import React, { useEffect, useState } from 'react'
import PostCard from '../../home/PostCard'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import request from '../../../common/utils/APIs/UserApis';
import { toast } from 'sonner';
import Loader from '../../../common/components/Loader';
import CommentContent from '../../home/CommentContent';

function SinglePostContent() {
    const [isPostLoading,setIsPosLoading] = useState(true);
    const {loggedUser} = useSelector((state)=>state.auth)
    const [post, setPost] = useState();
    const [comments, setComments] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const navigate = useNavigate();
    const { postId } = useParams();

    useEffect(()=>{
        request(
            "GET",
            `/post/getPostDetailsOfSaved/${postId}`,
            {}
        ).then((response)=>{
            setPost(response.data);
            setIsPosLoading(false)
            console.log("response of single post :",response);
        }).catch((error)=>{
            toast.error(error);
        })
    },[postId])

    // const [showPopup, setShowPopup] = useState(false); 
    // const togglePopup = () => {
    //     setShowPopup(!showPopup);
    //   };


    const fetchComments = async (postId) => {
        console.log("Fetching comments for post ID:", postId);
        setSelectedPost(postId);
        try {
            const response = await request("GET", `/post/comment/getCommentsByPostId/${postId}`,{});
            console.log("Fetching comments :", response.data);
            setComments(response);
            setSelectedPost(postId);
        } catch (error) {
            console.error('Error fetching comments:', error);
            toast.error(error.response ? error.response : error);
        }
    };

  return (
    <div className='flex bg-grey w-full h-full overflow-y-auto justify-center md:px-2 px-5' style={{ '-ms-overflow-style': 'none', 'scrollbar-width': 'none' }}>
        <div className='home-container pb-20 md:w-[80%] w-[100%]'>
            <div className='home-posts pb-20 '>
                {/* <h2 className='font-bold md:font-medium text-white w-full p-3 text-xl lg:px-10'>Home Feed</h2> */}
                {isPostLoading ? (
                        <Loader />
                    ) : (
                        <ul className='flex flex-col pt-5'>
                                <PostCard
                                key={post.postId} // Use a unique key for each post
                                imageUrl={post.image}
                                fullName={post.fullName}
                                caption={post.caption}
                                createdAt={post.createdAt}
                                profile={post.profileImage}
                                accountName={post.accountName}
                                postId={post.postId}
                                liked={post.liked}
                                likesCount={post.likeCount}
                                userId={post.userId}
                                saved={post.saved}
                                tag={post.tag}
                                onCommentClick={() => fetchComments(post.postId)}
                            />
                        </ul>
                    )}
            
            </div>
        </div>
        <div className={` overflow-hidden fixed lg:w-[60%] md:w-[70%] w-full h-[90%] bottom-0 px-2 transition-transform duration-300 ${selectedPost ? 'translate-y-0' : 'translate-y-full'} z-50`}>
        <CommentContent handleClose={() => setSelectedPost(null)}
            comments={comments.data}
            setComments={setComments}
            postId={selectedPost}
            />
      </div>
    </div>
  )
}

export default SinglePostContent