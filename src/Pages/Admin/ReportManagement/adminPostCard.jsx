import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import request from '../../../common/utils/APIs/UserApis';
import { toast } from 'sonner';
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import Slider from '../../home/slider';

function AdminPostCard(details) {
    const { imageUrl, fullName, caption,subscribed, createdAt,reportId, likesCount ,profile ,accountName,postId,liked,userId,saved,tag,onCommentClick } = details;
    const {loggedUser} = useSelector((state)=>state.auth)
    const [isLiked, setIsLiked] = useState(liked);
    const [likes,setLikes] = useState(likesCount);
    const [isSaved, setSaved] = useState(saved);
    const [dropdown,setDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const [reason, setReason] = useState('');
     

    // const handleLike = () => {
    //     console.log(typeof postId);
    //     if(isLiked){
    //         console.log("postId:"+postId)
    //         request(
    //             "POST",
    //             "/post/like/unLikePost", 
    //             {
    //                 postId:postId,
    //                 userId:loggedUser.id
    //             }
    //         )
    //         .then(response => {
    //             console.log('Received data:', response);
    //             setIsLiked(false);
    //             setLikes(likes-1);
    //         })
    //         .catch(error => {
    //             console.log(typeof postId)
    //             console.error('Error fetching data:', error);
    //             toast(error);
    //         });
    //     } else{
    //         request(
    //             "POST",
    //             "/post/like/likePost", 
    //             {
    //                 postId:postId,
    //                 userId:loggedUser.id
    //             }
    //         )
    //         .then(response => {
    //             console.log('Received data:', response);
    //             setIsLiked(true);
    //             setLikes(likes+1);
    //         })
    //         .catch(error => {
    //             console.error('Error fetching data:', error);
    //             toast(error);
    //         });
    //     }
    // }

    const handleDelete = () => {
        console.log(typeof postId);
        
        if(!reason.trim()){
            toast.error("reason cannot be empty..")
            return;
        }
        request("POST", `/post/delete-post?postId=${postId}&reason=${reason}&reportId=${reportId}`,{})
        .then((response) => {
            console.log("Response for deletePost:", response);
            setOpenModal(false)
            toast.success("Successfully deleted.");
            navigate("/admin/reports");
        })
        .catch((error) => {
            console.error("Error deleting post:", error);
            toast.error(error.message || "Failed to delete post."); 
        });
    };

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
                        className="fa-heart text-2xl cursor-pointer fa-solid text-green"
                        // onClick={handleLike}
                        ></i>
                        <p className='text-white'>{likes}</p>
                    </div>
                    <i class="fa-light fa-comment text-2xl text-green"  onClick={onCommentClick}></i>
                </div>
                {/* {loggedUser.id != userId && */}
                <div className='flex gap-2 mr-2 items-center'>
                    <i class="fa-light fa-trash text-red text-2xl cursor-pointer"
                    onClick={()=>setOpenModal(true)}
                    ></i>
                </div> 
                {/* } */}
            </div>
        </div>

        <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            {/* <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" /> */}
            <h3 className="text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className='pb-8 pt-5'>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Enter the reason" />
              </div>
              <TextInput
                id="reason"
                placeholder="reason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                required
              />
            </div>
            <div className="flex justify-center gap-4">
              <Button className='bg-red border-none text-black cursor-pointer' onClick={handleDelete}>
                {"Yes, I'm sure"}
              </Button>
              <Button className='bg-white text-black cursor-pointer border-black' onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

    </div>
  )
}

export default AdminPostCard