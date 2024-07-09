import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import request from '../../common/utils/APIs/UserApis';
import { toast } from 'sonner';
import Slider from './slider';
import { Dropdown } from 'flowbite-react';
import ReportPost from './ReportPost';

function PostCard(details) {
    const { imageUrl, fullName, caption,subscribed, createdAt, likesCount ,profile ,accountName,postId,liked,userId,saved,tag,onCommentClick } = details;
    const {loggedUser} = useSelector((state)=>state.auth)
    const [isLiked, setIsLiked] = useState(liked);
    const [likes,setLikes] = useState(likesCount);
    const [isSaved, setSaved] = useState(saved);
    const [dropdown,setDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
     

    const handleLike = () => {
        console.log(typeof postId);
        if(isLiked){
            console.log("postId:"+postId)
            request(
                "POST",
                "/post/like/unLikePost", 
                {
                    postId:postId,
                    userId:loggedUser.id
                }
            )
            .then(response => {
                console.log('Received data:', response);
                setIsLiked(false);
                setLikes(likes-1);
            })
            .catch(error => {
                console.log(typeof postId)
                console.error('Error fetching data:', error);
                toast(error);
            });
        } else{
            request(
                "POST",
                "/post/like/likePost", 
                {
                    postId:postId,
                    userId:loggedUser.id
                }
            )
            .then(response => {
                console.log('Received data:', response);
                setIsLiked(true);
                setLikes(likes+1);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                toast(error);
            });
        }
    }

    const handleSave = () => {
        console.log(typeof postId);
        if(isSaved){
            console.log("postId:"+postId)
            request(
                "DELETE",
                `/post/save/unSavePost/${postId}`,{}
            )
            .then(response => {
                console.log('Received data:', response);
                setSaved(false);
                // setLikes(likes-1);
            })
            .catch(error => {
                console.log(typeof postId)
                console.error('Error fetching data:', error);
                toast(error);
            });
        } else{
            request(
                "POST",
                `/post/save/savePost/${postId}`,{}
            )
            .then(response => {
                console.log('Received data:', response);
                setSaved(true);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                toast(error);
            });
        }
    }

    const profileLink = loggedUser.id === userId ? "/profile" : `/profile/${userId}`;

    const tagArray = tag?.split(',').map(tag => tag.trim());

  return (

    // <div className='flex flex-wrap gap-9 w-full max-w-5xl'>
    //             <ul className='flex flex-col gap-9'>
    //                 <li className='relative min-w-80 h-80 rounded-2xl overflow-hidden '></li>


    <div className='flex flex-wrap justify-center mt-6 lg:px-20'>
        {/* <div className='flex-between'> */}
        <div className='flex flex-col rounded-3xl border-black w-full p-5 bg-black gap-4'>
            <div className='flex justify-between items-center'>
                <div className='flex gap-3'>
                <Link to={profileLink} className='items-center'>
                <img src={profile || "/images/profile.jpg"} alt="profile"
                className='h-12 w-12 rounded-full'/>
                </Link>
                <div className='flex flex-col gap-1'>
                    <div className='flex gap-1 items-center'>
                    <p className='base-medium lg:body-bold text-white'>{accountName}</p>
                    {subscribed && <i className="fa-sharp fa-solid fa-badge-check text-xs text-green"></i>}

                    </div>
                    <div className='flex-center text-white'>
                        <p className='text-xs lg:text-xs font-thin text-green'>{createdAt}</p>
                    </div>
                </div>
                </div>
                <div className="relative pr-3 flex gap-2" ref={dropdownRef}>
                <i className="fa-light fa-ellipsis-vertical text-white text-lg cursor-pointer" onClick={() => setDropdown(!dropdown)}></i>
                    {dropdown && (
                        <ul className="absolute top-full mt-2 right-0 bg-grey rounded-lg shadow-lg z-20 w-48 px-4 pb-4 text-white grid grid-cols-1 divide-y divide-light_gray" >
                            <div className='flex justify-end py-2 cursor-pointer' onClick={()=>setDropdown(!dropdown)}>
                            <i class="fa-solid fa-xmark"></i>
                            </div>
                            {loggedUser.id === userId && 
                            <div className='flex text-white text-sm items-center px-4 py-2 gap-2 cursor-pointer' onClick={()=>navigate(`/edit-post/${postId}`)}>
                                <i className="fa-light fa-pen-to-square"></i>
                                <p className="dropdown-item hover:bg-gray ">Edit</p>
                            </div>}
                            <div className='flex text-white text-sm items-center px-4 py-2 gap-2 cursor-pointer'>
                                <i className="fa-light fa-circle-user text-base"></i>
                                <p className="dropdown-item hover:bg-gray ">Account details</p>
                            </div>
                            {loggedUser.id != userId && 
                            <ReportPost/>
                            }
                        </ul>
                    )}
                </div>
                {/* <Dropdown label="Dropdown button" dismissOnClick={false} className='bg-grey border-none'>
                    <Dropdown.Item><i className="fa-light fa-ellipsis-vertical text-white"/>Edit</Dropdown.Item>
                    <Dropdown.Item>Account Details</Dropdown.Item>
                    <Dropdown.Item>Report</Dropdown.Item>
                </Dropdown> */}
            </div>
            <div className='text-xs font-thin'>
                <p className='text-white'>{caption}</p>
                <ul className='flex gap-1 mt-1'>
                {tagArray?.map((tag, index) => (
                <li className='text-white'>#{tag}</li>
                ))}
                </ul>
            </div>
            {imageUrl.length > 1 ? (
            <div className="my-2 relative">
                 <Slider imageUrl={imageUrl}/>     
            </div>
            ):
            (<img 
            src={imageUrl[0]}
            alt="post-card-img" 
            className='rounded-2xl'
            />)}

            <div className='flex justify-between items-center z-20'>
                <div className='flex gap-6 items-center'>
                    <div className='flex gap-2 ml-2 items-center'>    
                        <i 
                        className={`fa-heart text-2xl cursor-pointer ${isLiked ? 'fa-solid text-green' : 'fa-light text-green'}`} 
                        onClick={handleLike}
                        ></i>
                        <p className='text-white'>{likes}</p>
                    </div>
                    <i class="fa-light fa-comment text-2xl text-green"  onClick={onCommentClick}></i>
                </div>
                {loggedUser.id != userId &&
                <div className='flex gap-2 mr-2 items-center'>
                    <i class={`fa-bookmark text-xl cursor-pointer ${isSaved ? 'fa-solid text-green' : 'fa-light text-green'}`}
                    onClick={handleSave}
                    ></i>
                </div> 
                }
            </div>
        </div>
    </div>
  )
}

export default PostCard