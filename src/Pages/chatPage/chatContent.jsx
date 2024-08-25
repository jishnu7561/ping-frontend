import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Picker from 'emoji-picker-react';
import request, { getAuthToken } from '../../common/utils/APIs/UserApis';

import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import { toast } from 'sonner';

function ChatContent() {
  const profile = null;
  const {chatId } = useParams();
  const navigate = useNavigate();
  const [message,setMessage] = useState();
  const [newMessage, setNewMessage] = useState('');
  const [chatDetails, setChatDetails] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const messageEndRef = useRef(null); // Ref to the message end
  const messageContainerRef = useRef(null); // Ref to the message container
  const { loggedUser } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [dropdown,setDropdown] = useState(false);
  const dropdownRef = useRef(null);

const [chats,setChats] = useState(new Map());


var stompClient = null;

// let socket = new SockJS('http://localhost:8085/ws', {
//   headers : {'Authorization': `Bearer ${getAuthToken()}`}
// });
// let socket = new SockJS('http://localhost:8085/ws'); 
let socket = new SockJS('https://chat.cravehub.online/ws'); 
stompClient= over(socket);


// stompClient.connect({}, onConnected, onError);

function onConnected() {
  console.log('Connected to WebSocket');
  stompClient.subscribe(`/chat/${chatId}`, onMessageReceived);
  sendReadStatus();
  onMessageGet();
  onMessageDelete();
}

const onMessageDelete = () =>{
  stompClient.subscribe(`/chat/message-deleted/${chatId}`, onMessageDeleted);
}

const onMessageDeleted = (payload) => {
  const deletedMessageId = JSON.parse(payload.body);
  // alert(deletedMessageId);
  setChatDetails(prevMessages => prevMessages.filter(message => message.id !== deletedMessageId));
};

const onMessageGet = () =>{
  // stompClient.subscribe(`/topic/message-deleted/${chatId}`, onMessageDeleted);
  stompClient.subscribe(`/chats/${chatId}`, allMessagesReceived);
}

useEffect(() => {
  stompClient.connect({}, onConnected, onError);
}, [chatId])


function onError(error) {
  console.error('WebSocket error:', error);
}

const allMessagesReceived = (payload) => {
  //console.log("Payload received from subscription: ", payload);
  const payloadData = JSON.parse(payload.body);
  //console.log("allMessageReceived: ", payloadData);
  // setChatDetails((prevMessages) => {
  //   const messageIds = new Set(prevMessages.map(message => message.id));
  //   const newMessages = payloadData.filter(message => !messageIds.has(message.id));
  //   return [...prevMessages, ...newMessages];
  // });
  setChatDetails(payloadData);
  scrollToBottom();
}

const onMessageReceived =(payload)=> {
  console.log("called...");

  const payloadData = JSON.parse(payload.body);
  console.log("new message: ",payloadData)
  const newMessage = {
    id: payloadData.id, 
    sender: payloadData.sender,
    receiver: payloadData.receiver,
    content: payloadData.content,
    createdAt: payloadData.createdAt, 
    chatId: payloadData.chatId 
  };
  console.log("chatDetails: ",chatDetails)

  setChatDetails((prevMessages)=>{
    const messageId = prevMessages.map((message) => message.id);
    if (!messageId.includes(newMessage.id)) {
      return [...prevMessages, newMessage];
    }
    return prevMessages;
  })
  console.log(chatDetails);
  setMessage('')
}

const setChange=()=>{
  console.log("chats after adding: ",chatDetails)
}

  // const sendMessageHandler = () => {
  //   // Add message sending logic here
  //   request("POST","/chat/sendMessage",{
  //     "chatId":chatId,
  //     "receiverId":userDetails.id,
  //     "content": message
  //   }).then((response)=>{
  //       setMessage("")
  //   })
  //   setNewMessage('');
  //   scrollToBottom(); // Scroll to bottom after sending a message
  // };

  function sendMessageHandler() {

    if(!message.trim()){
      toast("message must not be empty")
      return
    }
    const messageData = {
      "content": message,
      "chatId": chatId,
      "receiverId":userDetails.id,
      "senderId":loggedUser.id,
      "header": `Bearer ${getAuthToken()}`
    };
    stompClient.send('/app/sendMessage', {}, JSON.stringify(messageData));
    scrollToBottom();
  }


  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // useEffect(() => {
  //   request("PUT",`/chat/isRead/${chatId}`,{})
  //   .then((response)=>{
  //     console.log("isRead reponse: ",response);
  //   })
  // }, [chatId])

  const sendReadStatus = () => {
    // alert("clicked........");
    const messageData = {
      "chatId": chatId,
      "userId": loggedUser.id,
      "header": `Bearer ${getAuthToken()}`
    };
    stompClient.send('/app/isRead', {}, JSON.stringify(messageData));
  };
  

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messageResponse = await request("GET", `chat/getMessages/${chatId}`, {});
        console.log("Messages:", messageResponse.data);
        setChatDetails(messageResponse.data);

        const userDetails = await request("GET", `chat/getUserDetails/${chatId}`, {});
        console.log("Additional data:", userDetails.data);

        setUserDetails(userDetails.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchMessages();
    scrollToBottom();
  }, [chatId]);

  const navigationHandler = () => {
    navigate("/chat");
  };

  const toggleDropdown = (messageId) => {
    setDropdownOpen(prev => prev === messageId ? null : messageId);
  };

  const handleMessageDelete =(id)=>{
      setChatDetails(prevMessages => prevMessages.filter(message => message.id !== id));

    const messageData = {
      "chatId": chatId,
      "messageId": id,
    };

    stompClient.send(`/app/delete-message`, {}, JSON.stringify(messageData));

  }



  return (
    <div className='flex bg-grey w-full h-full border-r-4 border-grey'>
      <div className='home-container pb-20 w-full h-full px-10'>
        <div className='home-posts pb-20 w-full h-full'>
          <div className='flex justify-center items-center mt-4'>
            <div className='flex gap-2 w-full h-16 rounded-lg bg-black items-center'>
              <div className='flex gap-4 p-3 items-center'>
                <i className="fa-solid fa-angle-left text-white text-lg cursor-pointer" onClick={navigationHandler}></i>
                <div className='flex gap-3 items-center'>
                  <Link to="/" className='items-center'>
                    <img src={userDetails?.imageUrl || "/images/profile.jpg"} alt="profile" className='h-12 w-12 rounded-full' />
                  </Link>
                  <p className='text-white'>{userDetails?.accountName}</p>
                </div>
              </div>
            </div>
          </div>
          <div className='w-full mt-4 h-screen overflow-hidden rounded-xl bg-black h-[80%]'>
            <div
              ref={messageContainerRef} // Set ref to the message container
              className='bg-black h-[70%] rounded-xl overflow-y-auto justify-center p-8 px-5'
              style={{ '-ms-overflow-style': 'none', 'scrollbar-width': 'none' }}
            >
              <div className='flex flex-col gap-4 w-full'>
                {chatDetails?.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === loggedUser.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs p-3 rounded-lg ${message.sender === loggedUser.id ? 'bg-white text-black self-end' : 'bg-grey text-white self-start'}`}>
                      <div className='flex items-center gap-3'>
                        <p className='flex justify-start'>{message.content}</p>
                        {message.sender === loggedUser.id &&
                        // <i class="fa-light fa-angle-down text-black cursor-pointer" onClick={handleMessageDelete}></i>
                        
                        <div className="relative pr-3 flex gap-2" >
                          <i className="fa-light fa-angle-down text-black text-lg cursor-pointer" onClick={() => toggleDropdown(message.id)}></i>
                          {dropdownOpen === message.id && (
                            <ul className="absolute top-full mt-2 right-0 bg-grey rounded-lg shadow-lg z-20 w-48 px-4 pb-4 text-white grid grid-cols-1 divide-y divide-light_gray" >
                              <div className='flex justify-end py-2 cursor-pointer' onClick={() => toggleDropdown(message.id)}>
                                <i class="fa-solid fa-xmark"></i>
                              </div>
                              <div className='flex text-white text-sm items-center px-4 py-2 gap-2 cursor-pointer'>
                                <i className="fa-light fa-pen-to-square"></i>
                                <p className="dropdown-item hover:bg-gray " onClick={()=>handleMessageDelete(message.id)}>Delete</p>
                              </div>
                            </ul>
                          )}
                        </div>
                        }
                        <div className='flex items-center pt-5 gap-2'>
                        <p className='flex justify-end text-xs'>{message.createdAt}</p>
                        {
                        message.sender === loggedUser.id
                        && (
                          message.isRead
                            ? <i className="fa-regular fa-check-double text-blue font-bold	"></i>
                            : <i className="fa-regular fa-check-double text-light_gray"></i>
                        )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messageEndRef} /> 
              </div>
            </div>
            <div className='flex justify-center items-center mx-5 my-4 gap-2'>
              <div className='relative flex gap-2 px-4 w-full rounded-3xl bg-grey items-center'>
                {/* <i 
                  className="fa-light fa-smile text-white cursor-pointer"
                  onClick={() => setShowEmojiPicker(val => !val)}
                ></i> */}

                {/* {showEmojiPicker && (
                  <div className='absolute bottom-14'>
                    <Picker onEmojiClick={onEmojiClick} />
                  </div>
                )} */}
                <input 
                  type='text'
                  placeholder='Type a message'
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className='bg-grey h-10 focus:outline-none text-white w-full'
                ></input>
              </div>
              <div className='flex items-center gap-2 bg-black rounded-3xl cursor-pointer bg-green w-9 h-9 justify-center' onClick={sendMessageHandler}>
                <i className="fa-solid fa-paper-plane-top text-black" ></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatContent;




// import React, { useState, useEffect, useRef } from 'react';
// import { useSelector } from 'react-redux';
// import { Link, useNavigate, useParams } from 'react-router-dom';
// import { Client } from '@stomp/stompjs';
// import request from '../../common/utils/APIs/UserApis';

// function ChatContent() {
//   const { chatId } = useParams();
//   const navigate = useNavigate();
//   const [message, setMessage] = useState('');
//   const [chatDetails, setChatDetails] = useState([]);
//   const [userDetails, setUserDetails] = useState(null);
//   const messageEndRef = useRef(null);
//   const messageContainerRef = useRef(null);
//   const { loggedUser } = useSelector((state) => state.auth);
//   const [stompClient, setStompClient] = useState(null);

//   const scrollToBottom = () => {
//     messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const messageResponse = await request("GET", `chat/getMessages/${chatId}`, {});
//         setChatDetails(messageResponse.data);
//         const userDetails = await request("GET", `chat/getUserDetails/${chatId}`, {});
//         setUserDetails(userDetails.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchMessages();
//     scrollToBottom();
//   }, [chatId]);

//   useEffect(() => {
//     const client = new Client({
//       brokerURL: 'ws://localhost:8085/ws',
//       onConnect: () => {
//         client.subscribe('/topic/messages', (message) => {
//           const receivedMessage = JSON.parse(message.body);
//           if (receivedMessage.chatId === chatId) {
//             setChatDetails((prev) => [...prev, receivedMessage]);
//             scrollToBottom();
//           }
//         });
//       },
//     });

//     client.activate();
//     setStompClient(client);

//     return () => {
//       client.deactivate();
//     };
//   }, [chatId]);

//   const sendMessageHandler = () => {
//     const messageRequest = {
//       chatId,
//       receiverId: userDetails.id,
//       senderId:loggedUser.id,
//       content: message,
//     };

//     if (stompClient && stompClient.connected) {
//       stompClient.publish({
//         destination: '/app/sendMessage',
//         body: JSON.stringify(messageRequest),
//       });
//       setMessage('');
//     }
//   };

//   const navigationHandler = () => {
//     navigate("/chat");
//   };

//   return (
//     <div className='flex bg-grey w-full h-full border-r-4 border-grey'>
//       <div className='home-container pb-20 w-full h-full px-10'>
//         <div className='home-posts pb-20 w-full h-full'>
//           <div className='flex justify-center items-center mt-4'>
//             <div className='flex gap-2 w-full h-16 rounded-lg bg-black items-center'>
//               <div className='flex gap-4 p-3 items-center'>
//                 <i className="fa-solid fa-angle-left text-white text-lg cursor-pointer" onClick={navigationHandler}></i>
//                 <div className='flex gap-3 items-center'>
//                   <Link to="/" className='items-center'>
//                     <img src={userDetails?.imageUrl || "/images/profile.jpg"} alt="profile" className='h-12 w-12 rounded-full' />
//                   </Link>
//                   <p className='text-white'>{userDetails?.accountName}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className='w-full mt-4 h-screen overflow-hidden rounded-xl bg-black h-[80%]'>
//             <div
//               ref={messageContainerRef}
//               className='bg-black h-[70%] rounded-xl overflow-y-auto justify-center p-8 px-5'
//               style={{ '-ms-overflow-style': 'none', 'scrollbar-width': 'none' }}
//             >
//               <div className='flex flex-col gap-4 w-full'>
//                 {chatDetails?.map((message) => (
//                   <div
//                     key={message.id}
//                     className={`flex ${message.sender === loggedUser.id ? 'justify-end' : 'justify-start'}`}
//                   >
//                     <div className={`max-w-xs p-3 rounded-lg ${message.sender === loggedUser.id ? 'bg-white text-black self-end' : 'bg-grey text-white self-start'}`}>
//                       <div className='flex items-center gap-3'>
//                         <p className='flex justify-start'>{message.content}</p>
//                         <p className='flex justify-end text-xs pt-5'>8:30 PM</p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//                 <div ref={messageEndRef} />
//               </div>
//             </div>
//             <div className='flex justify-center items-center mx-5 my-4 gap-2'>
//               <div className='relative flex gap-2 px-4 w-full rounded-3xl bg-grey items-center'>
//                 <input
//                   type='text'
//                   placeholder='Type a message'
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   className='bg-grey h-10 focus:outline-none text-white w-full'
//                 ></input>
//               </div>
//               <div className='flex items-center gap-2 bg-black rounded-3xl cursor-pointer bg-green w-9 h-9 justify-center'>
//                 <i className="fa-solid fa-paper-plane-top text-black" onClick={sendMessageHandler}></i>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ChatContent;
