import React from 'react'
import Sidebar from '../../../common/components/Sidebar/Sidebar'
import UserProfileContent from './userProfileContent'
import Bottombar from '../../../common/components/Bottombar/bottombar'

function UserProfile() {
  return (
    <div className='flex min-h-screen'>
      <div className='flex w-screen'>
        <div className=' lg:w-[20%] hidden md:w-[30%] md:block'>
          <Sidebar />
        </div>
        <div className='lg:w-[80%] md:w-[70%] w-full h-screen overflow-hidden'>
          <UserProfileContent />
        </div>
      <div className='md:hidden sm:block z-50'>
        <Bottombar/>
      </div>
      </div>
    </div>
  )
}

export default UserProfile