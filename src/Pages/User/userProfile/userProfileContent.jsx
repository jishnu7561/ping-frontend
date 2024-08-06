import React,{useEffect,useState} from 'react'
import { Link,useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import request, { setAuthToken } from '../../../common/utils/APIs/UserApis';
import { toast } from 'sonner';
import ProfileCard from '../../../common/components/Profile/profileCard';

function UserProfileContent() {

    const {loggedUser} = useSelector((state) => state.auth);
    const { userId } = useParams();
    const [isFollowing,setFollowing] = useState();
    const [followers,setFollowers] = useState([]);
    const [isPrivate, setIsPrivate] = useState(false); // For private status
    const [followRequestStatus, setFollowRequestStatus] = useState(null);
    const [chatId,setChatId] = useState(null);
    const [data, setData] = useState({
      fullName:"",
      username:"",
      email:"",
      bio:"",
      image:"",
      private:""
    })
    const navigate = useNavigate();
    console.log(loggedUser.id);
    const logout = () => {
      setAuthToken(null);
      localStorage.removeItem('logged_user');
      navigate("/login")
    }

    useEffect(() => {
        // Use Promise.all to handle multiple asynchronous calls concurrently
        const fetchData = async () => {
          try {
            const [profileResponse, postCountResponse,followResponse,followRequestStatusResponse,chatIdResponse] = await Promise.all([
              request("GET", `/user/api/secure/profile/${userId}`, {}),
              request("GET", `/post/getPostCount/${userId}`, {}),
              request("POST", `/user/api/secure/isFollowing/${loggedUser.id}`, {followingId:userId}),
              request("GET", `/user/api/secure/request/followRequestStatus/${userId}`, {})
            ]);
    
            // Combine results into a single state update
            setData(prevData => ({
              ...prevData,
              ...profileResponse.data,
              postCount: postCountResponse.data
            }));
            setFollowers(profileResponse.data.followers.length)
            setFollowing(followResponse.data)
            setIsPrivate(profileResponse.data.private)
            setFollowRequestStatus(followRequestStatusResponse.data)
            // console.log("profile response in userProfile:",profileResponse.data)
            // console.log("postCount response in userProfile:",postCountResponse.data)
            // console.log("follow response in userProfile:",followResponse.data)
          } catch (error) {
            console.error('Error fetching data:', error);
            if (error.response && error.response.data.message) {
              toast(error.response.data.message);
            } else {
              toast('An error occurred');
            }
            // logout();
          }
        };
        fetchData();
      }, [userId]);

      const handleFollow = async () => {
        try {
          if (isFollowing) {
            await request(
              "DELETE",
              "/user/api/secure/unfollowUser",
              {
                followerId: loggedUser.id,
                followingId: userId
              }
            );
            setFollowing(false);
            setFollowers(followers - 1);

          } else if (isPrivate) {

            await request(
              "POST",
              "/user/api/secure/sendFollowRequest",
              {
                followerId: loggedUser.id,
                followingId: userId
              }
            );
            setFollowRequestStatus('PENDING');
            toast('Follow request sent');
          } else {

            await request(
              "POST",
              "/user/api/secure/followUser",
              {
                followerId: loggedUser.id,
                followingId: userId
              }
            );
            setFollowing(true);
            setFollowers(followers + 1);
          }
        } catch (error) {
          console.error('Error updating follow status:', error);
          toast('An error occurred');
        }
      };


      const handleMessagClick = () => {
        if (chatId == null) {
            request("POST", `/chat/createChat/${userId}`, {})
                .then((response) => {
                    console.log("create chat response: ", response.data.chatId);
                    const chatId = response.data.id;

                    if (chatId) {
                        navigate(`/chat/${chatId}`);
                    } else {
                        console.error("chatId is undefined in the response");
                    }
                })
                .catch((error) => {
                    console.error("Error creating chat: ", error);
                    // Handle error response if necessary
                });
        } else {
            navigate(`/chat/${data.chatId}`);
        }
    };


  return (
    <div className='w-full h-full bg-grey overflow-y-auto' style={{ '-ms-overflow-style': 'none', 'scrollbar-width': 'none' }}>
  <div className='flex flex-wrap w-full justify-center lg:p-10 '>
    <div className='flex flex-col w-full bg-black lg:p-10 p-5 gap-4 lg:rounded-xl'>
      <div className='flex lg:gap-10 gap-3'>
        <Link to={"/profile"} className='items-center'>
          <img src={data.image? data.image : "/images/profile.jpg"} alt="profile"
               className=' h-20 w-24 lg:h-24 lg:w-24 rounded-full'/> {/* Adjusted size */}
        </Link>  
        <div className='flex flex-col lg:gap-10 gap-5 w-full'>
          <div className='flex flex-col gap-1 lg:gap-3'>
            <div className='flex justify-between'>
              <p className='font-bold text-white lg:text-3xl'>{data.accountName}</p>
              {/* <i className="fa-light fa-pen-to-square lg:text-xl text-green cursor-pointer" onClick={()=>navigate("/edit-profile")}></i> */}

            </div>
            <div className='flex text-white gap-10 items-center'>
              <p className='text-xs lg:text-xl font-light text-green'>{data.fullName}</p>
              {isFollowing ? (
                  <button className='bg-grey text-green px-4 py-1 rounded-lg font-medium text-sm' onClick={handleFollow}>Following</button>
                ) : followRequestStatus === 'PENDING' ? (
                  <button className='bg-grey text-yellow px-4 py-1 rounded-lg font-medium text-sm' disabled>Requested</button>
                ) : (
                  <button className='bg-green text-black px-4 py-1 rounded-lg font-medium text-sm' onClick={handleFollow}>Follow</button>
                )}
              <p className='text-black bg-green px-4 py-1 rounded-lg font-medium text-sm cursor-pointer' onClick={handleMessagClick}>Messsage</p>  
            </div>
          </div>
          <div className='flex justify-between' >
            <div className='flex items-center gap-1 text-xs lg:text-lg'>
              <p className='text-green '>{data.postCount}</p>
              <p className='text-white '>posts</p>
            </div>
            <div className='flex items-center gap-1 text-xs lg:text-lg'>
              <p className='text-green '>{followers}</p>
              <p className='text-white '>followers</p>
            </div>
            <div className='flex items-center gap-1 text-xs lg:text-lg'>
              <p className='text-green '>{(data.following || []).length}</p>
              <p className='text-white '>following</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className='h-full px-10 pb-16'>
  {data.private ? (
          <p className='text-center text-white'>This account is private. Follow to see their posts.</p>
        ) : (
          <ProfileCard userId={userId} />
        )}
  </div>
</div>
  )
}

export default UserProfileContent