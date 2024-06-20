import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import request from '../../utils/APIs/UserApis';
import { toast } from 'sonner';
import Slider from '../../../Pages/home/slider';

function ImageCards(post) {
    const {imageUrl,liked,likesCount,postId,saved,isSave,handleSavedPost} = post;
    const {loggedUser} = useSelector((state)=>state.auth)
    const [isLiked, setIsLiked] = useState(liked);
    const [likes,setLikes] = useState(likesCount);
    const [isSaved, setSaved] = useState(saved);

    const [curr,setCurr] = useState(0);
    const prev = () =>
        setCurr((curr)=> (curr== 0 ? imageUrl.length-1 : curr-1))
    const next = () =>
        setCurr((curr)=> (curr== imageUrl.length-1 ? 0 : curr+1))


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
                handleSavedPost();
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

    const handleDelete = () =>{

        request(
            "DELETE",
            `/post/deletePost/${postId}`,
            {}
        )
        .then(response => {
            console.log('Received data:', response);
            handleSavedPost();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            toast.error(error);
        });
    }

  return (
    <div className="relative rounded-xl overflow-hidden w-60 h-56 group">
        {imageUrl.length > 1 ?
            // (<Slider imageUrl={imageUrl}></Slider>)
            (
                <>
        <img src={imageUrl[curr]} alt={`post image `} className="relative rounded-xl transition-all h-full" />
        <div className='absolute inset-0 flex flex items-center justify-between p-4'>
            <button className='p-1 ' onClick={prev}>
                <i class="fa-solid fa-arrow-left text-green"></i>
            </button>
            <button className='p-1 ' onClick={next}>
                <i class="fa-solid fa-arrow-right text-green"></i>
            </button>
        </div>
        <div className='absolute bottom-4 right-0 left-0'>
            <div className='flex items-center justify-center gap-2'>
            {imageUrl.map((_,i)=>(
                <div className={`transition-all w-2 h-2 bg-green rounded-full
                ${curr ===i? "p-1.5" : "bg-opacity-50"}`} onClick={()=>setCurr(i)}></div>
                ))}
            </div>
        </div>
    </>
            )
            :(<img src={imageUrl[0]} alt="image" className="object-fill w-full h-full" />)
        }
        <div className="flex justify-between absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white 
            text-center py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out px-2">
            <div className='flex gap-2 ml-2 items-center'>
                <i 
                className={`fa-heart text-2xl cursor-pointer ${isLiked? 'fa-solid text-green' : 'fa-light text-green'}`} 
                onClick={handleLike}></i>
                <p className='text-white'>{likes}</p>
            </div>
            {isSave ?
            (<div className='flex gap-2 mr-2 items-center'>
                <i class={`fa-bookmark text-xl cursor-pointer ${isSaved ? 'fa-solid text-green' : 'fa-light text-green'}`}
                onClick={handleSave}
                ></i>
            </div>) :
            
            (
            <div className='flex gap-2 mr-2 items-center'>
                <i class='fa-regular fa-trash-can text-red text-xl cursor-pointer'
                onClick={handleDelete}
                ></i>
            </div>)
            } 
        </div>
    </div>
  )
}

export default ImageCards