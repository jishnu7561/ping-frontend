import React from 'react'
import Sidebar from '../../common/components/Sidebar/Sidebar'
import HomeContent from './homeContent'
import Bottombar from '../../common/components/Bottombar/bottombar'

function Home() {
  return (
    <div className='flex h-screen w-full'>
      <div className='flex w-full'>
        <div className=' lg:w-[20%] md:w-[30%] hidden md:block '>
          <Sidebar />
        </div>
        <div className='lg:w-[60%] md:w-[70%] w-full h-screen overflow-hidden '>
          <HomeContent />
        </div>
        <div className=' lg:w-[20%] hidden lg:block '>
          <Sidebar />
        </div>
        
      </div>
      <div className='md:hidden sm:block fixed bottom-0 z-50'>
          <Bottombar/>
        </div>
    </div>
  )
}

export default Home