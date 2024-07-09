import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import request from '../../common/utils/APIs/UserApis';
import { toast } from 'sonner';

function ChatPageContent() {

    const navigate = useNavigate();
    const profile = null;
    const [search,setSearch] = useState("");
    const [userDetails,setUserDetails] = useState([])
    const [showArrowIcon, setShowArrowIcon] = useState(false);
    const [handleNavigation,setNavigation] = useState(false);


    const handleUserClick = (data) => {
        if (data.chatId == null) {
            request("POST", `/chat/createChat/${data.userId}`, {})
                .then((response) => {
                    console.log("create chat response: ", response.data);
                    navigate(`/chat/${response.data.chatId}`);
                })
                .catch((error) => {
                    console.error("Error creating chat: ", error);
                    // Handle error response if necessary
                });
        } else {
            navigate(`/chat/${data.chatId}`);
        }
    };

    
    useEffect(()=>{
        request("GET",
            "/chat/chatting",
            {}
        ).then((response)=>{
            console.log(response.data)
            setUserDetails(response.data)
        })
    },[showArrowIcon]);

    const seacrhHandler = async (e) => {
        console.log("clicked");
        try {
          const response = await request("GET", `/chat/search/${search}`, {
           
          });
          console.log(response);
          if (response.data) {
            setUserDetails(response.data)
          } else {
            console.log(response)
          }
        } catch (error) {
          console.error("Error:", error);
          
        }
    }

    const handleIconClick = () => {
        if (showArrowIcon) {
           setNavigation(true)
        }
    }



  return (
    <div className='flex bg-black w-full h-full border-r-4 border-grey'>
        <div className='home-container pb-20 w-full h-full px-10'>
            <div className='home-posts pb-20 w-full h-full'>
                {/* <h2 className='font-bold md:font-medium text-white w-full p-3 text-xl lg:px-5' >Home Feed</h2> */}
                {/* <div className='flex flex-wrap justify-center mt-6 lg:px-5'>
                    <div className='flex flex-col rounded-3xl border-black p-5 bg-grey  gap-4 h-screen w-[80%]'>
                    </div>
                </div> */}
                <div className='flex justify-center items-center mx-5 my-4'>
                    <div className='flex gap-2 px-4 w-full rounded-lg bg-grey items-center'>
                    <i className={showArrowIcon ? "fa-light fa-arrow-left text-white cursor-pointer" : "fa-light fa-magnifying-glass text-white"} onClick={handleIconClick}></i>
                        <input 
                        type='text'
                        placeholder='Search'
                        className='bg-grey h-10 focus:outline-none text-white w-full'
                        value={search}
                        onChange={(e)=>setSearch(e.target.value)}
                        onFocus={()=>setShowArrowIcon(true)}
                        onBlur={()=>setShowArrowIcon(false)}
                        ></input>
                    </div>
                    <div className='flex items-center gap-2 bg-black rounded-xl px-4 py-2 cursor-pointer' onClick={seacrhHandler}>
                        <p className='text-white font-light'>All</p>
                        <i className="fa-light fa-bars-filter text-white"></i>
                    </div>
                </div>
                <div className='w-full pt-4 px-4 h-screen overflow-hidden '>
                    <div className='h-full overflow-y-auto justify-center md:px-2 px-5' style={{ '-ms-overflow-style': 'none', 'scrollbar-width': 'none' }}>
                    {userDetails.map((data, index) => (
                        <div key={index} className='border-b-2 border-light_gray px-3 py-3 cursor-pointer' onClick={() => handleUserClick(data)}>
                            <div className='flex gap-3'>
                                <Link to="/" className='items-center'>
                                <img src={data.imageUrl || "/images/profile.jpg"} alt="profile" className='h-12 w-12 rounded-full' />
                                </Link>
                                <div className='flex flex-col'>
                                    <p className='text-white'>{data.accountName}</p>
                                    <p className='text-grey test-xs font-semibold'>{data?.lastMessage}</p>
                                </div>
                                <p className='text-grey test-xs font-semibold'>{data?.lastMessageDate}</p>
                            </div>
                            {/* <div className='bg-grey w-full h-96' >
                                <p className='text-white'>hello</p>
                            </div> */}
                        </div>
                    ))}   
                    </div>
                </div>
                    
            </div>
        </div>
    </div>
  )
}

export default ChatPageContent