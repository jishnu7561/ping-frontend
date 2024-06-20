import React from 'react'
import ExploreContent from './exploreContent'
import Sidebar from '../../common/components/Sidebar/Sidebar'
import Bottombar from '../../common/components/Bottombar/bottombar'


function Explore() {
  return (
    <div className='flex '>
      <div className='flex'>
        <div className='flex-auto lg:w-[20%] hidden md:block fixed top-0'>
          <Sidebar />
        </div>
        <ExploreContent />
      <div className='md:hidden sm:block'>
        <Bottombar/>
      </div>
      </div>
    </div>
  )
}

export default Explore