import React from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { setAuthToken } from '../../common/utils/APIs/UserApis';

function AdminSidebar() {
  const { pathname } = useLocation();
  const { loggedUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem('logged_user');
    navigate('/login');
  };

  return (
    <div className='h-screen flex'>
      <div className='w-[20%] flex flex-col gap-8 bg-black'>
        <div className='text-center py-4'>
          <h1 className='font-bold text-6xl text-white'>
            P<span className='text-green'>I</span>NG
          </h1>
        </div>
        <div className='flex justify-center'>
          <Link to="/profile" className='flex gap-3 items-center'>
            <img
              src={loggedUser?.imageUrl || '/images/profile.jpg'}
              alt="profile"
              className='h-14 w-14 rounded-full'
            />
            <div className='flex flex-col'>
              <p className='font-semibold text-green'>
                {loggedUser?.accountName || 'Username'}
              </p>
              <p className='font-thin text-white text-sm'>
                {loggedUser?.email || 'user@example.com'}
              </p>
            </div>
          </Link>
        </div>
        <nav className="flex flex-col mx-10">
        <ul className='flex flex-col gap-6 font-sans  text-white'>
          <NavLink to={"/admin/dashboard"}>
          <li className={`py-2 group rounded-md hover:bg-green flex md:justify-center lg:justify-start items-center ${pathname === '/admin/dashboard' && 'bg-green'} cursor-pointer`}>
            <i className={`fa-regular fa-house px-5 text-green group-hover:text-white ${pathname === '/admin/dashboard' && 'text-white'} ${!pathname === '/admin/dashboard' && 'md:hidden'}`} ></i>
            <p className='md:hidden lg:block'>Dashboard</p>
          </li>
          </NavLink>
          <NavLink to={"/admin/users"}>
          <li className={`py-2 group rounded-md hover:bg-green flex md:justify-center lg:justify-start items-center ${pathname === '/admin/users' && 'bg-green'} cursor-pointer`}>
            <i className={`fa-regular fa-user px-5 text-green group-hover:text-white ${pathname === '/admin/users' && 'text-white'} ${!pathname === '/admin/users' && 'md:hidden'}`} ></i>
            <p className='md:hidden lg:block'>Users</p>
          </li>
          </NavLink>
          <NavLink to={"/admin/reports"}>
            <li className={`py-2 group rounded-md hover:bg-green flex md:justify-center lg:justify-start items-center ${pathname === '/admin/reports' && 'bg-green'} cursor-pointer`}>
              <i className={`fa-regular fa-circle-exclamation px-5 text-green group-hover:text-white ${pathname === '/admin/reports' && 'text-white'} ${!pathname === '/admin/reports' && 'md:hidden'}`} ></i>
              <p className='md:hidden lg:block'>Reports</p>
            </li>    
          </NavLink>
          <NavLink to={"/admin/chat"}>
            <li className={`py-2 group rounded-md hover:bg-green flex md:justify-center lg:justify-start items-center ${pathname === '/admin/chat' && 'bg-green'} cursor-pointer`}>
              <i className={`fa-regular  fa-message-lines px-5 text-green group-hover:text-white ${pathname === '/admin/chat' && 'text-white'} ${!pathname === '/admin/chat' && 'md:hidden'}`} ></i>
              <p className='md:hidden lg:block'>Chat</p>
            </li>
          </NavLink>
          {/* <NavLink to={"/create-post"}>
            <li className={`py-2 group rounded-md hover:bg-green flex md:justify-center lg:justify-start items-center ${pathname === '/create-post' && 'bg-green'} cursor-pointer`}>
              <i className={`fa-regular  fa-message-lines px-5 text-green group-hover:text-white ${pathname === '/create-post' && 'text-white'} ${!pathname === '/create-post' && 'md:hidden'}`} ></i>
              <p className='md:hidden lg:block'>Message</p>
            </li>
          </NavLink> */}
          <NavLink to={"/login"} onClick={logout}>
          <li className='py-2 mt-10 cursor-pointer text-sm'>
            <i className="fa-regular fa-right-from-bracket text-red px-5"></i>Logout</li>
          </NavLink>
        </ul>
        </nav>
      </div>
      <div className='w-[80%]'>
        <Outlet />
      </div>
    </div>
  );
}

export default AdminSidebar;
