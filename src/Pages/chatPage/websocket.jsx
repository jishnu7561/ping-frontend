// import { Client } from '@stomp/stompjs';
// import SockJS from 'sockjs-client';

// const socket = new SockJS('http://localhost:8085/ws');
// const stompClient = new Client({
//   webSocketFactory: () => socket,
//   reconnectDelay: 5000,
//   debug: (str) => {
//     console.log(str);
//   }
// });

// export const connect = (onMessageReceived) => {
//   stompClient.onConnect = (frame) => {
//     console.log('Connected: ' + frame);
//     stompClient.subscribe('/topic/chat', (message) => {
//       onMessageReceived(JSON.parse(message.body));
//     });
//   };

//   stompClient.activate();
// };

// export const sendMessage = (message) => {
//   stompClient.publish({
//     destination: '/app/chat.sendMessage',
//     body: JSON.stringify(message)
//   });
// };

// export const disconnect = () => {
//   if (stompClient.connected) {
//     stompClient.deactivate();
//   }
// };





// const [stompClient,setStompClient] = useState();
// const [isConnect,setIsConnect] = useState(false);
// const [messages,setMessages] = useState([]);


// const connect =()=>{
//   const stock = new SockJS("http://localhost:8085/ws");
//   const temp = over(stock);
//   setStompClient(temp);

//   const headers= {
//     Authorization:`Bearer ${token}`,
//     "X-XSRF-TOKEN":getCookies("XSRF-TOKEN")
//   }
// }

// function getCookies(name) {
//   const value= `; {document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if(parts.length===2) {
//     return parts.pop().split(";").shift();
//   }
// }

// const onError = (error) =>{
//   console.log("no error ",error);
// }

// const onConnect = () =>{
//   setIsConnect(true);
// }

// useEffect(()=>{
//   if(newMessage && stompClient){
//     setMessages([...messages.newMessage]);
//     stompClient?.send("/app/message",{},JSON.stringify(newMessage));
//   }
// },newMessage)

// const onMessageReceive=(payload)=>{
//   console.log("receive message" , JSON.parse(payload.body))
//   const receiveMessage = JSON.parse(payload.body);
//   setMessage([messages,recivedMessage]);
// }

// useEffect(()=>{

// })




