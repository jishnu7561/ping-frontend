import React, { useEffect, useState } from 'react'
import { Link,NavLink, useLocation,useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import request, { setAuthToken } from '../../utils/APIs/UserApis'
import { toast } from 'sonner'
import SockJS from 'sockjs-client'
import { over } from 'stompjs'

const Sidebar =() => {
  const {pathname} = useLocation()
  const {loggedUser} = useSelector((state)=>state.auth)
  const navigate  = useNavigate();
  const [count,setCount] = useState(0)

  let stompClient = null;

  let socket = new SockJS('http://localhost:8085/ws'); 
  stompClient = over(socket);

  useEffect(() => {
      stompClient.connect({}, onConnected, onError);

      request("GET",`/chat/notificationCount/${loggedUser.id}`,{})
    .then((response)=>{
        console.log("notification count: ",response)
        setCount(response.data);
    }).catch((error)=>{
        console.log("count error: ",error)
    })
  }, [loggedUser.id]);

  const onConnected = () => {
      console.log('Connected to WebSocket');
      stompClient.subscribe(`/chat/notification/${loggedUser.id}`, onMessageReceived);
      
  };


  const onMessageReceived = (payload) => {
      console.log("Notification received...");
      // const notification = JSON.parse(payload.body);
      // console.log("Notification content: ", notification);
      setCount(prevCount => prevCount + 1);

  };

  const onError = (error) => {
      console.error('WebSocket error:', error);
  };


  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem('logged_user');
    toast.success("logged-out successfully");
    navigate("/login")
  }


  return (
    <div className='h-screen flex flex-col  gap-8 bg-black border-r-4 border-grey'>  
      <div className="text-center py-4">
        <h1 className='font-bold text-6xl text-white'>P<span className='text-green'>I</span>NG</h1>
      </div>
      <div className='flex justify-center'>
        <Link to={"/profile"} className='flex gap-3 items-center'>
          <img src={loggedUser?.imageUrl ||"/images/profile.jpg"} alt="profile"
          className='h-14 w-14 rounded-full' />
          <div className='flex flex-col'>
          <p className='font-semibold text-green'>{loggedUser?.accountName}</p>
          <p className='font-thin text-white text-sm'>{loggedUser?.fullName}</p>
        </div>
        </Link>
      </div>
      <nav className="flex flex-col content-between mx-10  ">
        <ul className='flex flex-col gap-6 font-sans  text-white'>
          <NavLink to={"/"}>
          <li className={`py-2 group rounded-md hover:bg-green flex md:justify-center lg:justify-start items-center ${pathname === '/' && 'bg-green'} cursor-pointer`}>
            <i className={`fa-regular fa-house px-5 text-green group-hover:text-white ${pathname === '/' && 'text-white'} ${!pathname === '/' && 'md:hidden'}`} ></i>
            <p className='md:hidden lg:block'>Home</p>
          </li>
          </NavLink>
          <NavLink to={"/profile"}>
          <li className={`py-2 group rounded-md hover:bg-green flex md:justify-center lg:justify-start items-center ${pathname === '/profile' && 'bg-green'} cursor-pointer`}>
            <i className={`fa-regular fa-user px-5 text-green group-hover:text-white ${pathname === '/profile' && 'text-white'} ${!pathname === '/profile' && 'md:hidden'}`} ></i>
            <p className='md:hidden lg:block'>Profile</p>
          </li>
          </NavLink>
          <NavLink to="/notifications">
    <li className={`relative py-2 group rounded-md hover:bg-green flex md:justify-center lg:justify-start items-center ${pathname === '/notifications' && 'bg-green'} cursor-pointer`}>
        <div className="relative">
            <i className={`fa-regular fa-bell px-5 text-green group-hover:text-white ${pathname === '/notifications' && 'text-white'} ${!pathname === '/notifications' && 'md:hidden'}`}></i>
            {/* Notification count */}
            {count > 0 && (
                <span className={`absolute top-0 right-3 bg-green text-white text-xs rounded-3xl px-1 text-xs text-center`}>
                    {count}
                </span>
            )}
        </div>
        <p className='md:hidden lg:block'>Notification</p>
    </li>
</NavLink>
          <NavLink to={"/chat"}>
            <li className={`py-2 group rounded-md hover:bg-green flex md:justify-center lg:justify-start items-center ${pathname === '/chat' && 'bg-green'} cursor-pointer`}>
              <i className={`fa-regular  fa-message-lines px-5 text-green group-hover:text-white ${pathname === '/chat' && 'text-white'} ${!pathname === '/chat' && 'md:hidden'}`} ></i>
              <p className='md:hidden lg:block'>Message</p>
            </li>
          </NavLink>
          <NavLink to={"/create-post"}>
            <li className={`py-2 group rounded-md hover:bg-green flex md:justify-center lg:justify-start items-center ${pathname === '/create-post' && 'bg-green'} cursor-pointer`}>
              <i className={`fa-regular  fa-message-lines px-5 text-green group-hover:text-white ${pathname === '/create-post' && 'text-white'} ${!pathname === '/create-post' && 'md:hidden'}`} ></i>
              <p className='md:hidden lg:block'>Create</p>
            </li>
          </NavLink>
          <NavLink to={"/login"} onClick={logout}>
          <li className='py-2 mt-10 cursor-pointer text-sm'>
            <i className="fa-regular fa-right-from-bracket text-green px-5"></i>Logout</li>
          </NavLink>
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar