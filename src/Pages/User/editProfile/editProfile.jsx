import React from 'react'
import Sidebar from '../../../common/components/Sidebar/Sidebar'
import Bottombar from '../../../common/components/Bottombar/bottombar'
import EditForm from './editForm'

function EditProfile() {
  return (
    <div className='flex min-h-screen fixed'>
      <div className='flex w-screen'>
        <div className=' lg:w-[20%] hidden md:w-[30%] md:block'>
          <Sidebar />
        </div>
        <div className='lg:w-[80%] md:w-[70%] w-full lg:h-screen h-full overflow-hidden '>
          <EditForm />
        </div>
      <div className='md:hidden sm:block z-50'>
        <Bottombar/>
      </div>
      </div>
    </div>
  )
}

export default EditProfile