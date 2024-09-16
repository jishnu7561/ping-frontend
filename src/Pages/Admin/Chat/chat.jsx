import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import request from '../../../common/utils/APIs/UserApis';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';

function Chat() {
    const navigate = useNavigate();
    const profile = null;
    const [search,setSearch] = useState("");
    const [userDetails,setUserDetails] = useState([])
    const [showArrowIcon, setShowArrowIcon] = useState(false);
    const [handleNavigation,setNavigation] = useState(false);

    const {loggedUser} = useSelector((state)=>state.auth);

    const handleUserClick = (data) => {
        if (data.chatId == null) {
            request("POST", `/chat/createChat/${data.userId}`, {})
                .then((response) => {
                    console.log("create chat response: ", response.data.chatId);
                    const chatId = response.data.id;

                    if (chatId) {
                        navigate(`/chat/${chatId}`);
                    } else {
                        console.error("chatId is undefined in the response");
                    }
                })
                .catch((error) => {
                    console.error("Error creating chat: ", error);
                    // Handle error response if necessary
                });
        } else {
            navigate(`/admin/chat/${data.chatId}`);
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


    var stompClient = null;
// let socket = new SockJS('http://localhost:8085/ws'); // Replace with your server endpoint
let socket = new SockJS('https://chat.cravehub.online/ws'); 
stompClient = over(socket);


// stompClient.connect({}, onConnected, onError);

function onConnected() {
  console.log('Connected to WebSocket');
  stompClient.subscribe(`/chatting-users`, onMessageReceived);
}

useEffect(() => {
  stompClient.connect({}, onConnected, onError);

}, [loggedUser.id])


function onError(error) {
  console.error('WebSocket error:', error);
}

const onMessageReceived =(payload)=> {
  console.log("called...");
  const payloadData = JSON.parse(payload.body);
  console.log("new chattings : ",payloadData)
  setUserDetails(prevUserDetails => {
    // Update userDetails based on the received payloadData
    const updatedUserDetails = prevUserDetails.map(user => {
        // Find and update the user if the chatId matches
        if (user.chatId === payloadData.chatId) {
            return {
                ...user,
                lastMessage: payloadData.content,
                // lastMessageDate: payloadData.lastMessageDate
            };
        }
        return user; // Return unchanged if no match
    });

    return updatedUserDetails;
});
}



  return (
    <div className='flex bg-grey w-full h-full border-r-4 border-grey p-10'>
        <div className='home-container  w-full h-full px-10 rounded-2xl bg-black'>
            <div className='home-posts w-full h-full'>
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
                <div className='w-full pt-4 px-4 h-[80%] overflow-hidden '>
                    <div className='h-full overflow-y-auto justify-center md:px-2 px-5' style={{ '-ms-overflow-style': 'none', 'scrollbar-width': 'none' }}>
                    {userDetails.map((data, index) => (
                        data.userId !== loggedUser.id && (
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
                        </div>)
                    ))}   
                    </div>
                </div>
                    
            </div>
        </div>
    </div>
  )
}

export default Chat