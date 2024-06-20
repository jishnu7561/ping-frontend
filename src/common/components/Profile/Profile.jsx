import React from 'react'
import Sidebar from '../Sidebar/Sidebar'
import ProfileContent from './ProfileContent'
import Bottombar from '../Bottombar/bottombar'

function Profile() {
  return (
    <div className='flex min-h-screen'>
      <div className='flex w-screen'>
        <div className=' lg:w-[20%] hidden md:w-[30%] md:block'>
          <Sidebar />
        </div>
        <div className='lg:w-[80%] md:w-[70%] w-full h-screen overflow-hidden'>
          <ProfileContent />
        </div>
      <div className='md:hidden sm:block z-50'>
        <Bottombar/>
      </div>
      </div>
    </div>
  )
}

export default Profile