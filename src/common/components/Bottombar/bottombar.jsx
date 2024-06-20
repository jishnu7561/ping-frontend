import React from 'react'
import { Link,useLocation , NavLink } from 'react-router-dom'

function Bottombar() {
    const {pathname} = useLocation();
  return (
    <section className='bottom-0 right-0 left-0 fixed  bg-black border-t-2 border-grey text-white w-full h-[10%] rounded-t-3xl'>
        <ul className='flex font-sans justify-evenly p-[3%]'>
          <NavLink to={"/"}>
          <li className={`${pathname === '/' && 'bg-button-green'} h-12 w-12 rounded-full flex items-center justify-center`}>
            <i className={`fa-regular fa-house text-green text-2xl cursor-pointer ${pathname === '/' && 'text-white'}`} ></i></li>
          </NavLink>
          <NavLink to={"/profile"}>
          <li className={`${pathname === '/profile' && 'bg-button-green'} h-12 w-12 rounded-full flex items-center justify-center`}>
            <i className={`fa-regular fa-user text-green text-2xl cursor-pointer ${pathname === '/profile' && 'text-white'}`} ></i></li>
          </NavLink>
          <NavLink to={"/notification"}>
          <li className={`${pathname === '/notification' && 'bg-button-green'} h-12 w-12 rounded-full flex items-center justify-center`}>
            <i className={`fa-regular fa-bell text-green text-2xl cursor-pointer ${pathname === '/notification' && 'text-white'}`} ></i></li>
          </NavLink>
          <NavLink to={"/message"}>
          <li className={`${pathname === '/message' && 'bg-button-green'} h-12 w-12 rounded-full flex items-center justify-center`}>
            <i className={`fa-regular fa-message-lines text-green text-2xl cursor-pointer ${pathname === '/message' && 'text-white'}`} ></i></li>
          </NavLink>
          <NavLink to={"/create-post"}>
          {/* className={`py-2 group rounded-md hover:bg-green ${pathname === '/message' && 'bg-green'} cursor-pointer`} */}
          <li className={`${pathname === '/create-post' && 'bg-button-green'} h-12 w-12 rounded-full flex items-center justify-center`}>
            <i className={`fa-regular fa-image  text-green text-2xl cursor-pointer ${pathname === '/create-post' && 'text-white'}`} ></i></li>
          </NavLink>
        </ul>
    
    </section>
  )
}

export default Bottombar