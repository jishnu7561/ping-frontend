import React,{useEffect,useState} from 'react'
import Loader from '../../common/components/Loader';
import PostCard from './PostCard';
import { useSelector } from 'react-redux';
import request,{setAuthToken} from '../../common/utils/APIs/UserApis';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

function HomeContent() {

    const [isPostLoading,setIsPosLoading] = useState(true);
    const {loggedUser} = useSelector((state)=>state.auth)
    const [posts, setPosts] = useState([]);
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
            toast.error(error.response? error.response.data.message : error);
        });
    }, [loggedUser.id]);
    
  return (
    <div className='flex bg-grey w-full h-full overflow-y-auto justify-center md:px-2 px-5' style={{ '-ms-overflow-style': 'none', 'scrollbar-width': 'none' }}>
        <div className='home-container pb-20'>
            <div className='home-posts pb-20'>
                <h2 className='font-bold md:font-medium text-white w-full p-3 text-xl lg:px-10'>Home Feed</h2>
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
                            />

                            ))}
                        </ul>
                    )}
            
            </div>
        </div>
    </div>
  )
}

export default HomeContent