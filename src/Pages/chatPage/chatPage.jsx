import React from 'react'
import Sidebar from '../../common/components/Sidebar/Sidebar'
import ChatPageContent from './chatPageContent'
import Bottombar from '../../common/components/Bottombar/bottombar'
import { useParams } from 'react-router-dom'
import ChatContent from './chatContent'

function ChatPage() {
    const {chatId } = useParams();
  return (
    <div className='flex h-screen w-full fixed'>
      <div className='flex w-full'>
        <div className=' lg:w-[20%] md:w-[30%] hidden md:block '>
          <Sidebar />
        </div>
        {chatId  ?
        (<div className='lg:w-[60%] md:w-[70%] w-full '>
            <ChatContent/>
          </div>):
          (<div className='lg:w-[60%] md:w-[70%] w-full '>
            <ChatPageContent />
          </div>)
        }
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

export default ChatPage