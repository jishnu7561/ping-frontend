import React from 'react'
import Bottombar from '../../common/components/Bottombar/bottombar'
import Sidebar from '../../common/components/Sidebar/Sidebar'
import CreatePostContent from './createPostContent'

function CreatePost() {
  return (
    <div className='flex min-h-screen fixed'>
      <div className='flex w-screen'>
        <div className=' lg:w-[20%] md:w-[30%] hidden md:block '>
          <Sidebar />
        </div>
        <div className=' lg:w-[80%] md:w-[70%] w-full lg:h-screen h-full overflow-hidden '>
          <CreatePostContent />
        </div>
        
      </div>
      <div className='md:hidden sm:block fixed bottom-0 z-50'>
          <Bottombar/>
        </div>
    </div>
  )
}

export default CreatePost