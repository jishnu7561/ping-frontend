import React,{useEffect,useState} from 'react'
import Loader from '../../common/components/Loader';
import PostCard from './PostCard';
import { useSelector } from 'react-redux';
import request,{setAuthToken} from '../../common/utils/APIs/UserApis';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import CommentContent from './CommentContent';

function HomeContent() {

    const [isPostLoading,setIsPosLoading] = useState(true);
    const {loggedUser} = useSelector((state)=>state.auth)
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const navigate = useNavigate();

    const logout = () => {
        setAuthToken(null);
        localStorage.removeItem('logged_user');
        navigate("/login")
      }

    useEffect(() => {
        request(
            "GET",
            `/post/getAllPosts/${loggedUser.id}`, 
            {}
        )
        .then(response => {
            console.log('Received post data:', response);
            setPosts(response.data)
            setIsPosLoading(false);
            
            // console.log("data:::::"+response.data[0].image);
            // setImage(response.data[0].image);
            // setsecImage(response.data[1].image)
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            // logout();
            toast.error("Internal server error");
        });
    }, [loggedUser.id]);


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
            setComments(response.data);
            setSelectedPost(postId);
        } catch (error) {
            console.error('Error fetching comments:', error);
            toast.error(error.response ? error.response : error);
        }
    };

    
  return (
    <div className='flex bg-grey w-full h-full overflow-y-auto justify-center md:px-2 px-5' style={{ '-ms-overflow-style': 'none', 'scrollbar-width': 'none' }}>
        <div className='home-container pb-20'>
            <div className='home-posts pb-20'>
                <h2 className='font-bold md:font-medium text-white w-full p-3 text-xl lg:px-10' >Home Feed</h2>
                {isPostLoading ? (
                        <Loader />
                    ) : (
                        <ul className='flex flex-col'>
                            {posts?.map((post, index) => (
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
                                subscribed={post.subscribed}
                                onCommentClick={() => fetchComments(post.postId)}
                            />

                            ))}
                        </ul>
                    )}
            
            </div>
        </div>

      {/* Pop-up div */}
      <div className={` overflow-hidden fixed lg:w-[60%] md:w-[70%] w-full h-[90%] bottom-0 px-2 transition-transform duration-300 ${selectedPost ? 'translate-y-0' : 'translate-y-full'} z-50`}>
        <CommentContent handleClose={() => setSelectedPost(null)}
            comments={comments}
            setComments={setComments}
            postId={selectedPost}
            />
      </div>



    </div>
  )
}

export default HomeContent