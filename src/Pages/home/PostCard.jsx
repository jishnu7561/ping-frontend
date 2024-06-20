import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import request from '../../common/utils/APIs/UserApis';
import { toast } from 'sonner';
import Slider from './slider';

function PostCard(details) {
    const { imageUrl, fullName, caption, createdAt, likesCount ,profile ,accountName,postId,liked,userId,saved} = details;
    const {loggedUser} = useSelector((state)=>state.auth)
    const [isLiked, setIsLiked] = useState(liked);
    const [likes,setLikes] = useState(likesCount);
    const [isSaved, setSaved] = useState(saved);
     

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

  return (

    // <div className='flex flex-wrap gap-9 w-full max-w-5xl'>
    //             <ul className='flex flex-col gap-9'>
    //                 <li className='relative min-w-80 h-80 rounded-2xl overflow-hidden '></li>


    <div className='flex flex-wrap justify-center mt-6 lg:px-20'>
        {/* <div className='flex-between'> */}
        <div className='flex flex-col rounded-3xl border-black w-full p-5 bg-black gap-4'>
            <div className='flex gap-3'>
                <Link to={profileLink} className='items-center'>
                <img src={profile || "/images/profile.jpg"} alt="profile"
                className='h-12 w-12 rounded-full'/>
                </Link>
                <div className='flex flex-col gap-1'>
                    <p className='base-medium lg:body-bold text-white'>{accountName}</p>
                    <div className='flex-center text-white'>
                        <p className='text-xs lg:text-xs font-thin text-green'>{createdAt}</p>
                    </div>
                </div>
            </div>
            <div className='text-xs font-thin'>
                <p className='text-white'>{caption}</p>
                <ul className='flex gap-1 mt-1'>
                    <li className='text-white'>#tag</li>
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
                <div className='flex gap-2 ml-2 items-center'>
                <i 
                className={`fa-heart text-2xl cursor-pointer ${isLiked ? 'fa-solid text-green' : 'fa-light text-green'}`} 
                onClick={handleLike}
                ></i>
                <p className='text-white'>{likes}</p>
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