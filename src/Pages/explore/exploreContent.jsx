import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import request from '../../common/utils/APIs/UserApis';
import { useSelector } from 'react-redux';
import Loader from '../../common/components/Loader';


function ExploreContent() {
    const [showArrowIcon, setShowArrowIcon] = useState(false);
    const [search,setSearch] = useState('');
    const [posts,setPosts] = useState([]);
    const {loggedUser} = useSelector((state)=> state.auth)
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(3);
    const [filter,setFilter] = useState('');
    const [isLoading,setIsLoading] = useState(true);
    const [showFilter,setShowFilter] = useState(false);

    const searchHandler=()=>{
        request("GET", `/post/all-posts?search=${search}&filter=${filter}&page=${currentPage}&size=${pageSize}`, {})
        .then((response)=>{
            console.log("all post response: ",response.data)
            setPosts(response.data.content);
            setIsLoading(false)
            setTotalPages(response.data.totalPages);
        }).catch((error)=>{
            console.log("all post error: ",error)
        })
    }

    useEffect(()=>{
        searchHandler();
    },[search, filter, currentPage, pageSize, loggedUser.id])

    // const handlePageChange = (newPage) => {
    //     setCurrentPage(newPage);
    //     searchHandler();
    // };
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    const showFilterOnClick = ()=>{
        setShowFilter(!showFilter);
        setFilter('');
    }


  return (
        <div className='w-full h-full bg-black lg:bg-grey overflow-y-auto' style={{ '-ms-overflow-style': 'none', 'scrollbar-width': 'none' }}>
            <div className='flex flex-wrap w-full justify-center lg:p-10 pb-20'>
                <div className='flex flex-col w-full gap-10 bg-black lg:p-10 p-5 pt-10 lg:rounded-xl'>
                    <div className='flex gap-2'>
                        <img src="/images/add-post.svg" alt="post" className='w-6' />
                        <h2 className='text-white font-semibold'>Explore</h2>
                    </div>
                    <div className='flex flex-col mx-5 my-4 gap-2'>
                        <div className='flex gap-2 px-4 w-full rounded-lg bg-grey items-center'>
                            <i className={showArrowIcon ? "fa-light fa-arrow-left text-white cursor-pointer" : "fa-light fa-magnifying-glass text-white"} ></i>
                            <input 
                            type='text'
                            placeholder='Search'
                            className='bg-grey h-10 focus:outline-none text-white w-full'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onFocus={() => setShowArrowIcon(true)}
                            onBlur={() => setShowArrowIcon(false)}
                            />
                        </div>
                        <div className='flex gap-2 items-center'>
                        <div className='flex items-center gap-2 bg-black rounded-xl px-4 py-2 cursor-pointer' onClick={showFilterOnClick}>
                            <p className='text-white font-light'>All</p>
                            <i className="fa-light fa-bars-filter text-white"></i>
                        </div>
                        {showFilter && <div className='flex gap-3'>
                            <p className={`cursor-pointer ${filter === 'caption' ? 'underline text-green' : 'text-white'}`} onClick={() => setFilter('caption')}>caption</p>
                            <p className={`cursor-pointer ${filter === 'tag' ? 'underline text-green' : 'text-white'}`} onClick={() => setFilter('tag')}>tag</p>
                            <p className={`cursor-pointer ${filter === 'recent' ? 'underline text-green' : 'text-white'}`} onClick={() => setFilter('recent')}>recent</p>
                        </div>}
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-9 items-center justify-center w-full'>
                    {isLoading ? (
                        <div className='w-full flex items-center mt-10'>
                            <Loader />
                        </div>
                    ) : (
                        <ul className='flex flex-wrap justify-center gap-9 w-full'>
                            {posts.map((post, index) => (
                                <li key={index} className='relative w-60 h-40 rounded-2xl overflow-hidden'>
                                    {post.imageUrls.length > 1 && (<div className='header absolute inset-x-0 top-0 flex items-center justify-end py-2 px-4 bg-black bg-opacity-60'> 
                                        <div className='flex gap-1 items-center'>
                                        <i class="fa-solid fa-files text-white"></i>
                                        </div>
                                    </div>)}
                                    <Link to={`/single-post/${post.id}`}>
                                        <img src={post.imageUrls[0] || "/images/profile.jpg"} className='h-full w-full object-cover' alt='post' />
                                    </Link>
                                    <div className='footer absolute inset-x-0 bottom-0 flex items-center justify-between py-2 px-4 bg-black bg-opacity-60'>
                                        <div className='flex gap-2'>
                                            <img src={post.profile || "/images/profile.jpg"} alt="creator" className='h-8 w-8 rounded-full' />
                                            <p className='line-clamp-1 text-white'>{post.accountName}</p>
                                        </div> 
                                        <div className='flex gap-1 ml-2 items-center'>
                                            <i className="fa-light fa-heart text-green text-xl"></i>
                                            <p className='text-white'>{post.likesCount}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>)}
                    </div>
                    <div className='flex w-full justify-center'>
                    <div className='flex mt-4 items-center'>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className='text-white bg-gray-700 px-4 py-2 rounded'
                    >
                        Previous
                    </button>
                    <span className='text-white'>{`Page ${currentPage + 1} of ${totalPages}`}</span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages - 1}
                        className='text-white bg-gray-700 px-4 py-2 rounded'
                    >
                        Next
                    </button>
                </div>
                </div>
                </div>
            </div>
        </div>
  )
}

export default ExploreContent