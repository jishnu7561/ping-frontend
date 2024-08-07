import React from 'react'
import Sidebar from '../../common/components/Sidebar/Sidebar'
import HomeContent from './homeContent'
import Bottombar from '../../common/components/Bottombar/bottombar'
import UserSearchBar from '../../common/components/Sidebar/userSearchBar'

function Home() {
  return (
    <div className='flex h-screen w-full fixed'>
      <div className='flex w-full'>
        <div className=' lg:w-[20%] md:w-[30%] hidden md:block '>
          <Sidebar />
        </div>
        <div className='lg:w-[60%] md:w-[70%] w-full h-screen overflow-hidden '>
          <HomeContent />
        </div>
        <div className=' lg:w-[20%] hidden lg:block '>
          <UserSearchBar />
        </div>
        
      </div>
      <div className='md:hidden sm:block fixed bottom-0 z-50'>
          <Bottombar/>
        </div>
    </div>
  )
}

export default Home