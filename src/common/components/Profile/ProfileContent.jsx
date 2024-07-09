import React,{useEffect,useRef,useState} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import request from '../../utils/APIs/UserApis';
import { setAuthToken } from '../../utils/APIs/UserApis';
import { toast } from 'sonner';
import ProfileCard from './profileCard';
import { updateLoggedUser } from '../../../Redux/Slices/AuthSlice';
import Subscription from './Subscription';

function ProfileContent() {

  const {loggedUser} = useSelector((state) => state.auth);
  const [change,setChange] = useState(true);
  const [dropdown,setDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
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
          request("GET", `/post/getPostCount/${loggedUser.id}`, {}),
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
  }, [loggedUser.id,change]);

  const handleChange = () => {
    setChange(!change);
  }

  const [isPrivate, setIsPrivate] = useState(loggedUser.private);

  // Handle change event for the checkbox
  const handleCheckboxChange = () => {
    setIsPrivate(prevState => !prevState);
    request("POST",
      "/user/api/secure/handlePrivacy",
      {}
    ).then((response)=>{

      dispatch(updateLoggedUser({
        private:!loggedUser.private,
        subscribed:response.data.subscribed,
        subscriptionEndDate:response.data.subscriptionEndDate
      }))
    }).catch((error)=>{
        toast.error(error)
    })
  };


  

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
              <div className='flex gap-3 items-center'>
              <p className='font-bold text-white lg:text-3xl'>{data.accountName}</p>
              {loggedUser.subscribed && <i className="fa-sharp fa-solid fa-badge-check text-base text-green"></i>}
              </div>
              <div className='flex gap-4'>
              <i className="fa-light fa-pen-to-square lg:text-xl text-green cursor-pointer" onClick={()=>navigate("/edit-profile")}></i>
              {/* <i class="fa-light fa-gear lg:text-xl text-green cursor-pointer"></i> */}
              <div className="relative pr-3 flex gap-2" ref={dropdownRef}>
                <i className="fa-light fa-gear lg:text-xl text-green cursor-pointer" onClick={() => setDropdown(!dropdown)}></i>
                    {dropdown && (
                        <ul className="absolute top-full mt-2 right-0 bg-grey rounded-lg shadow-lg z-20 w-64 px-4 pb-4 text-white grid grid-cols-1 divide-y divide-light_gray" >
                            <div className='flex justify-end py-2 cursor-pointer' onClick={()=>setDropdown(!dropdown)}>
                            <i class="fa-solid fa-xmark"></i>
                            </div>
                            <div className='flex text-white text-sm items-center px-4 py-2 gap-4 ' >
                                <div className='flex text-white text-sm items-center gap-2'>
                                <i class="fa-light fa-lock"></i>
                                <p className="dropdown-item hover:bg-gray ">Account privacy</p>
                                </div>
                                <label class="inline-flex items-center  cursor-pointer">
                                  <input type="checkbox" checked={isPrivate} class="sr-only peer"
                                  onChange={handleCheckboxChange}
                                  />
                                  <div class="relative w-9 h-5 bg-black  rounded-full peer dark:bg-light_gray peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-grey after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-light_gray peer-checked:bg-green"></div>
                                </label>
                            </div>
                            <Subscription />
   
                            {/* <div className='flex text-red text-sm items-center px-4 py-2 gap-2 cursor-pointer'>
                                <i class="fa-regular fa-message-exclamation"></i>
                                <p className="dropdown-item hover:bg-gray ">Report</p>
                            </div> */}
                        </ul>
                    )}
                </div>
              </div>
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
      <ProfileCard handleChange={handleChange} />
  </div>
</div>

  )
}

export default ProfileContent