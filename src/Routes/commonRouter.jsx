import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Signup from '../common/components/Signup/Signup'
import Login from '../common/components/Login/Login'
import Profile from '../common/components/Profile/Profile'
import Home from '../Pages/home/home'
import Explore from '../Pages/explore/explore'
import OTP from '../common/components/OTP/otpVerification'
import Userprotect from '../common/components/Login/userprotect'
import NotFound from '../Pages/NotFound'
import EditProfile from '../Pages/User/editProfile/editProfile'
import CreatePost from '../Pages/createPost/createPost'
import UserProfile from '../Pages/User/userProfile/userProfile'

function CommonRouter() {
  return (
    <Routes>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>} />
        <Route path='/otp-verification' element={<OTP/>} />
        <Route element={<Userprotect/>}>
          <Route path='/profile' element={<Profile/>} />
          <Route path='/profile/:userId' element={<UserProfile />} /> 
          <Route path='/' element={<Home/>}/>
          <Route path='/explore' element={<Explore/>}/>
          <Route path='/edit-profile' element={<EditProfile/>}/>
          <Route path='/create-post' element={<CreatePost/>} />
        </Route>
        <Route path="/*" element={<NotFound />} />
    </Routes>
  )
}

export default CommonRouter