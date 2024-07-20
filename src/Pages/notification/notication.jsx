import React from 'react'
import Sidebar from '../../common/components/Sidebar/Sidebar'
import NotificationContent from './notificationContent'
import Bottombar from '../../common/components/Bottombar/bottombar'
import UserSearchBar from '../../common/components/Sidebar/userSearchBar'

function Notication() {
  return (
    <div className='flex min-h-screen fixed'>
      <div className='flex w-screen'>
        <div className=' lg:w-[20%] md:w-[30%] hidden md:block '>
          <Sidebar />
        </div>
        <div className=' lg:w-[60%] md:w-[70%] w-full lg:h-screen h-full overflow-hidden '>
          <NotificationContent />
        </div>
        <div className=' lg:w-[20%] md:w-[30%] hidden md:block '>
          <UserSearchBar />
        </div>
      </div>
      <div className='md:hidden sm:block fixed bottom-0 z-50'>
          <Bottombar/>
        </div>
    </div>
  )
}

export default Notication