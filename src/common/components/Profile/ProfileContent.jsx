import React,{useEffect,useState} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import request from '../../utils/APIs/UserApis';
import { setAuthToken } from '../../utils/APIs/UserApis';
import { toast } from 'sonner';
import ProfileCard from './profileCard';

function ProfileContent() {

  const {loggedUser} = useSelector((state) => state.auth);
  const [data, setData] = useState({
    fullName:"",
    username:"",
    email:"",
    bio:""
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
        const [profileResponse, postCountResponse] = await Promise.all([
          request("GET", `/user/api/secure/profile/${loggedUser.id}`, {}),
          request("GET", `/post/getPostCount/${loggedUser.id}`, {})
        ]);

        // Combine results into a single state update
        setData(prevData => ({
          ...prevData,
          ...profileResponse.data,
          postCount: postCountResponse.data
        }));
        console.log(profileResponse)
        console.log(postCountResponse)
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response && error.response.data.message) {
          toast(error.response.data.message);
        } else {
          toast('An error occurred');
        }
        logout();
      }
    };

    fetchData();
  }, [loggedUser.id]);


  return (
  <div className='w-full h-full md:bg-grey bg-black flex flex-col overflow-y-auto' style={{ '-ms-overflow-style': 'none', 'scrollbar-width': 'none' }}>
  <div className='flex w-full justify-center lg:p-10' >
    <div className='flex flex-col w-full bg-black lg:p-10 p-5 gap-4 lg:rounded-xl '>
      <div className='flex lg:gap-10 gap-3'>
        <Link to={"/profile"} className='items-center'>
          <img src={loggedUser.imageUrl || "/images/profile.jpg"} alt="profile"
               className=' h-20 w-24 lg:h-24 lg:w-24 rounded-full'/> {/* Adjusted size */}
        </Link>  
        <div className='flex flex-col lg:gap-10 gap-5 w-full'>
          <div className='flex flex-col gap-1 lg:gap-3'>
            <div className='flex justify-between'>
              <p className='font-bold text-white lg:text-3xl'>{data.accountName}</p>
              <i className="fa-light fa-pen-to-square lg:text-xl text-green cursor-pointer" onClick={()=>navigate("/edit-profile")}></i>
            </div>
            <div className='flex-center text-white'>
              <p className='text-xs lg:text-xl font-light text-green'>{data.fullName}</p>
            </div>
          </div>
          <div className='flex justify-between' >
            <div className='flex items-center gap-1 text-xs lg:text-lg'>
              <p className='text-green '>{data.postCount}</p>
              <p className='text-white '>posts</p>
            </div>
            <div className='flex items-center gap-1 text-xs lg:text-lg'>
              <p className='text-green '>{(data.followers || []).length}</p>
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
      <ProfileCard />
  </div>
</div>

  )
}

export default ProfileContent