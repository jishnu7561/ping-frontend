import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { toast } from 'sonner';
import { over } from 'stompjs';
import request, { getAuthToken } from '../../../common/utils/APIs/UserApis';

function ChattingPage() {
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
  
  const [chats,setChats] = useState(new Map());
  
  
  var stompClient = null;
  
  // let socket = new SockJS('http://localhost:8085/ws', {
  //   headers : {'Authorization': `Bearer ${getAuthToken()}`}
  // });
  let socket = new SockJS('http://localhost:8085/ws'); // Replace with your server endpoint
  stompClient= over(socket);
  
  
  // stompClient.connect({}, onConnected, onError);
  
  function onConnected() {
    console.log('Connected to WebSocket');
    stompClient.subscribe(`/chat/${chatId}`, onMessageReceived);
  }
  
  useEffect(() => {
    stompClient.connect({}, onConnected, onError);
  
  }, [chatId])
  
  
  function onError(error) {
    console.error('WebSocket error:', error);
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
      createdAt: new Date().toISOString(), 
      chatId: payloadData.chatId 
    };
    console.log("chatDetails: ",chatDetails)
    // const messageExists = chatDetails.some(message => message.id == newMessage.id);
  
    // if (!messageExists) {
    //   setChatDetails((prevMessages) => [...prevMessages, newMessage]);
    // }
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
      // socketIo.emit("/app/chat/send",{
      //   content:"test messs"
      // })
      // socketIo.emit("/send",{
      //   content:"test messs"
      // })
      // socketIo.emit("/app/send",{
      //   content:"test messs"
      // })
      scrollToBottom();
    }
  
  
    const scrollToBottom = () => {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
  
    useEffect(() => {
      const fetchMessages = async () => {
        try {
          const messageResponse = await request("GET", `chat/getMessages/${chatId}`, {});
          console.log("Messages:", messageResponse.data);
          setChatDetails(messageResponse.data);
    
          // Make another independent request
          const userDetails = await request("GET", `chat/getUserDetails/${chatId}`, {});
          console.log("Additional data:", userDetails.data);
          // Handle additional data (optional: you can set another state or log it)
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
  
  
  
  
    // useEffect(() => {
  
  
    //   socketIo.on("message", (newMessage) => {
    //     setMessages((prevMessages) => {
    //       const messageIds = prevMessages.map((message) => message._id);
    //       if (!messageIds.includes(newMessage._id)) {
    //         return [...prevMessages, newMessage];
    //       }
    //       return prevMessages;
    //     });
    //   });
  
    //   // Clean up on component unmount
    //   return () => {
    //     socket.off("newMessage");
    //   };
    // }, []);
  
  
    return (
      <div className='flex bg-grey w-full h-full border-r-4 border-grey'>
        <div className='home-container  w-full h-screen px-10'>
          <div className='home-posts w-full h-screen'>
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
            <div className='w-full mt-4 overflow-hidden rounded-xl bg-black h-[80%]'>
              <div
                ref={messageContainerRef} // Set ref to the message container
                className='bg-black h-[80%] rounded-xl overflow-y-auto justify-center p-8 px-5'
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
                          <p className='flex justify-end text-xs pt-5'>8:30 PM</p>
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
  
  export default ChattingPage;
  
