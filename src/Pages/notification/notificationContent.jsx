import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import request from '../../common/utils/APIs/UserApis';
import Loader from '../../common/components/Loader';
import { useNavigate } from 'react-router-dom';

function NotificationContent() {
    const [notifications, setNotifications] = useState([]);
    const [isLoading,setLoading] = useState(true);
    const navigate = useNavigate()
    let stompClient = null;
    const {loggedUser} = useSelector((state)=>state.auth)

    let socket = new SockJS('http://localhost:8085/ws'); 
    stompClient = over(socket);

    useEffect(() => {
        stompClient.connect({}, onConnected, onError);

        request("GET",`/chat/notifications/${loggedUser.id}`,{})
        .then((response)=>{
            console.log("notification response: ",response.data)
            setNotifications(response.data);
            setLoading(false)
        }).catch((error)=>{
            console.log("notification response error: ",error)
        })
    }, [loggedUser.id]);

    const onConnected = () => {
        console.log('Connected to WebSocket');
        stompClient.subscribe(`/chat/notification/${loggedUser.id}`, onMessageReceived);
        onReadStatus();
    };

    const onReadStatus =() =>{
        const messageData = {
            "userId": loggedUser.id,
          };
          stompClient.send('/app/isReadNotification', {}, JSON.stringify(messageData));
    }

    const onMessageReceived = (payload) => {
        console.log("Notification received...");
        const notification = JSON.parse(payload.body);
        console.log("Notification content: ", notification);
        setNotifications((prevNotifications) => [notification,...prevNotifications]);
    };

    const onError = (error) => {
        console.error('WebSocket error:', error);
    };

    const renderNotificationContent = (notification) => {
        switch (notification.type) {
            case 'LIKE':
                return <>
                <div className='flex items-center gap-5'>
                    <img src={notification.profileImage} alt="" 
                    className='w-10 h-10 rounded-3xl' />
                    <p className='text-white font-thin text-sm'>
                        <span className='text-white font-bold'>{notification.sender}  </span>
                           liked your post .
                    </p>
                </div>
                </>
            case 'COMMENT':
                return <>
                <div className='flex items-center gap-5'>
                    <img src={notification.profileImage} alt="" 
                    className='w-10 h-10 rounded-3xl' />
                    <p className='text-white font-thin text-sm'>
                        <span className='text-white font-bold'>{notification.sender}  </span>
                           commented on your post .
                    </p>
                </div>
                </>
            case 'FRIEND_REQUEST':
                return <>
                    <div className='flex items-center gap-5'>
                        <img src={notification.profileImage} alt="" 
                        className='w-10 h-10 rounded-3xl' />
                        <p className='text-white font-thin text-sm'>
                            <span className='text-white font-bold'>{notification.sender}  </span>
                             requested to follow you .
                        </p>
                    </div>
                    </>
            case 'FRIEND_REQUEST_ACCEPTED':
                return <>
                    <div className='flex items-center gap-5'>
                        <img src={notification.profileImage} alt="" 
                        className='w-10 h-10 rounded-3xl' />
                        <p className='text-white font-thin text-sm'>
                            <span className='text-white font-bold'>{notification.sender}  </span>
                             friendRequest accepted .
                        </p>
                    </div>
                    </>
            case 'FOLLOW':
                return <>
                    <div className='flex items-center gap-5'>
                        <img src={notification.profileImage} alt="" 
                        className='w-10 h-10 rounded-3xl' />
                        <p className='text-white font-thin text-sm'>
                            <span className='text-white font-bold'>{notification.sender}  </span>
                             started following you .
                        </p>
                    </div>
                    </>
            case 'UNFOLLOW':
                return <>
                    <div className='flex items-center gap-5'>
                        <img src={notification.profileImage} alt="" 
                        className='w-10 h-10 rounded-3xl' />
                        <p className='text-white font-thin text-sm'>
                            <span className='text-white font-bold'>{notification.sender}  </span>
                             unfollowed you .
                        </p>
                    </div>
                    </>
            default:
                return <p className='text-white'></p>;
        }
    };

    const handleRejectRequest = ({ notificationId, requestId }) => {
    //  alert(requestId)
        const request1 = request("DELETE", `/chat/delete-notification/${notificationId}`, {});
        const request2 = request("DELETE", `/user/api/secure/request/rejectFollowRequest/${requestId}`, {});
    
        Promise.all([request1, request2])
            .then(([response1, response2]) => {
                console.log("delete notificaton response: ", response1);
                console.log("reject follow request response: ", response2);
                setNotifications((prevNotifications) => 
                    prevNotifications.filter(notification => notification.notificationId !== notificationId)
                );
             
            })
            .catch((error) => {
                console.error("Error handling requests:", error);
            });
    };

    const handleAcceptRequest = ({ notificationId, requestId }) =>{
        const request1 = request("DELETE", `/chat/delete-notification/${notificationId}`, {});
        const request2 = request("POST", `/user/api/secure/request/approveFollowRequest/${requestId}`, {});
    
        Promise.all([request1, request2])
            .then(([response1, response2]) => {
                console.log("delete notificaton response: ", response1);
                console.log("accept follow request response: ", response2);
                setNotifications((prevNotifications) => 
                    prevNotifications.filter(notification => notification.notificationId !== notificationId)
                );
             
            })
            .catch((error) => {
                console.error("Error handling requests:", error);
            });
    }

    return (
        <div className='w-full h-full bg-black lg:bg-grey overflow-y-auto' style={{ '-ms-overflow-style': 'none', 'scrollbar-width': 'none' }}>
            <div className='flex flex-wrap w-full justify-center lg:px-20 lg:p-16 pb-20'>
                <div className='flex flex-col w-full gap-10 bg-black lg:p-10 p-5 pt-10 gap-8 lg:rounded-xl'>
                    <div className='flex gap-2 items-center'>
                        <i className="fa-light fa-bell text-white text-2xl"></i>
                        <h2 className='text-white font-semibold'>Notifications</h2>
                    </div>
                    {isLoading ? (
                        <div className='w-full flex items-center'>
                            <Loader />
                        </div>
                    ) : (
                    <div className='w-full px-20 py-6 flex flex-col items-center'>
                        {notifications.length > 0 ? (
                            notifications.map((notification, index) => (
                                <div key={index} className='w-full py-2'>
                                    {/* {renderNotificationContent(notification)} */}
                                    <div className='flex justify-between items-center gap-3'>
                                        <div className='flex items-center gap-3'>
                                        {renderNotificationContent(notification)}
                                        </div>
                                        <div className='flex gap-6 items-center'>
                                        <p className='text-grey text-sm font-semibold'>{notification.createdAt}</p>

                                        {(notification.type === 'LIKE' || notification.type === 'COMMENT') && (
                                            <img src={notification.postImage} alt="" className='w-10 h-10 rounded-xl cursor-pointer' 
                                            onClick={()=>navigate(`/single-post/${notification.postId}`)}
                                            />
                                        )}
                                        {(notification.type === 'FRIEND_REQUEST') &&
                                            (<div className='flex gap-3 items-center'>
                                                <div className='w-16 h-6 bg-grey flex items-center justify-center rounded-lg cursor-pointer'
                                                 onClick={()=>handleAcceptRequest({ notificationId: notification.notificationId, requestId: notification.requestId })}>
                                                    <p className='text-white text-sm '>confirm</p>
                                                </div>
                                                <i class="fa-solid fa-xmark text-grey cursor-pointer" 
                                                onClick={() => handleRejectRequest({ notificationId: notification.notificationId, requestId: notification.requestId })}></i>
                                            </div>)
                                        }
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className='text-white'>No notifications</p>
                        )}
                    </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default NotificationContent;
