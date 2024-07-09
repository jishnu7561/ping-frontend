import React from 'react'
import Bottombar from '../../../common/components/Bottombar/bottombar'
import Sidebar from '../../../common/components/Sidebar/Sidebar'
import SinglePostContent from './singlePostContent'

function SinglePost() {
  return (
    <div className='flex h-screen w-full fixed'>
      <div className='flex w-full'>
        <div className=' lg:w-[20%] md:w-[30%] hidden md:block '>
          <Sidebar />
        </div>
        <div className='lg:w-[80%] md:w-[70%] w-full h-screen overflow-hidden '>
          <SinglePostContent />
        </div>
      </div>
      <div className='md:hidden sm:block fixed bottom-0 z-50'>
          <Bottombar/>
        </div>
    </div>
  )
}

export default SinglePost