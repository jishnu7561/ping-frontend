import React, { useEffect, useState } from 'react'
import ImageCards from './imageCards'
import request from '../../utils/APIs/UserApis';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';

function ProfileCard({userId,handleChange}) {

    const {loggedUser} = useSelector((state)=>state.auth);
    const [posts, setPosts] = useState([]);
    const [isSaved,setSaved] = useState(false);
    let id = userId;


    useEffect(()=>{

        if(!userId) {
            // console.log("id of user  ="+userId)
            id = loggedUser.id;
        }
        // console.log("id of user="+id)
        if(isSaved){ 
            request("GET","/post/save/getSavedPosts",{})
            .then((response)=>{
                // console.log("saved post: ",response.data)
                setPosts(response.data);
            }).catch((error)=>{
                toast.error(error);
                console.log(error);
            })
        } else {
            request("GET",`/post/getUserPosts/${id}`,{})
            .then((response)=>{
                setPosts(response.data);
            }).catch((error)=>{
                toast.error(error)
                console.log(error);
            })
        }
    },[isSaved,posts])
    // isSaved,posts

    const handleSaved = (data) => () => {
        console.log(posts);
        if (data === "post") {
            setSaved(false);
        } else {
            setSaved(true);
        }
    };

    const handleSavedPost = () => {
        setPosts(null);
        handleChange();
    }



  return (
    <div className='w-full h-full pb-10'>
        <div className='flex justify-center items-center w-full bg-black rounded-2xl py-5'>
            <div className={`border-green px-10  ${isSaved? '' : 'border-b-2'}`}>
                <h3 className='text-white font-semibold cursor-pointer' onClick={handleSaved("post")}>Posts</h3>
            </div>
            {!userId &&
            (<div className={`border-green px-8  ${isSaved? 'border-b-2' : ''}`}>
                <h3 className='text-white font-semibold cursor-pointer' onClick={handleSaved("save")}>Saved</h3>
            </div>)
            }
        </div>
        <div className='flex flex-wrap pt-10 justify-center gap-2'>
            {posts?.map((post,index)=>(
                <ImageCards key={post.postId} 
                imageUrl={post.image}
                postId={post.postId}
                liked={post.liked}
                likesCount={post.likeCount}
                userId={post.userId}
                saved={post.saved}
                isSave={isSaved}
                handleSavedPost={handleSavedPost}
                />
            ))}
            
        </div>
    </div>
  )
}

export default ProfileCard