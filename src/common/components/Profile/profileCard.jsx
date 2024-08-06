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
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(2);
    const [totalPages, setTotalPages] = useState(0);


    useEffect(() => {
        if (!userId) {
            id = loggedUser.id;
        }
        if (isSaved) {
            request("GET", `/post/save/getSavedPosts?page=${currentPage}&size=${pageSize}`, {})
                .then((response) => {
                    setPosts(response.data.content);
                    setTotalPages(response.data.totalPages);
                }).catch((error) => {
                    toast.error(error);
                    console.log(error);
                });
        } else {
            request("GET", `/post/getUserPosts/${id}?page=${currentPage}&size=${pageSize}`, {})
                .then((response) => {
                    setPosts(response.data.content);
                    setTotalPages(response.data.totalPages);
                }).catch((error) => {
                    toast.error(error);
                    console.log(error);
                });
        }
    }, [isSaved, currentPage, pageSize]);
    // },[isSaved,posts,isSaved, currentPage, pageSize])
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

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };



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
        <div className='flex justify-center items-center mt-24'>
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className='text-white bg-black px-4 py-2 rounded'
            >
                Previous
            </button>
            <span className='text-white mx-2'>{`Page ${currentPage + 1} of ${totalPages}`}</span>
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className='text-white bg-black px-4 py-2 rounded'
            >
                Next
            </button>
        </div>
    </div>
  )
}

export default ProfileCard