import React, { useEffect, useState } from 'react'
import { Link,NavLink, useLocation,useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import request, { setAuthToken } from '../../utils/APIs/UserApis'
import { toast } from 'sonner'
import Loader from '../Loader'

const UserSearchBar =() => {
  const {pathname} = useLocation()
  const {loggedUser} = useSelector((state)=>state.auth)
  const navigate  = useNavigate();
  const [search,setSearch] = useState('')
  const [allUser,setAllusers] = useState([])
  const [isLoading,setLoading] = useState(true)

  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem('logged_user');
    toast.success("logged-out successfully");
    navigate("/login")
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const fetchUsers = (search = '') => {
    request(
        "GET",
        `/user/api/secure/getAllUsersOnSearch?search=${search}`,
        {}
    )
    .then(response => {
        console.log("search user: ",response.data)
        setAllusers(response.data);
        setLoading(false);
        // setTotalPages(response.data.totalPages);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
  };

    useEffect(() => {
        fetchUsers(search,);
    }, [search,loggedUser.id]);

    const handleView = (id) =>{
        navigate(`/profile/${id}`)
    }



  return (
    <div className='h-screen flex flex-col  gap-8 bg-black border-r-4 border-grey'>  
      <div className='flex flex-col gap-4 px-3'>
        <div className='search py-8'>
            <div className='flex gap-2 px-4 w-full rounded-lg bg-grey items-center'>
                <i className="fa-light fa-magnifying-glass text-white cursor-pointer"></i>
                <input 
                    type='text'
                    placeholder='Search'
                    className='bg-grey h-10 focus:outline-none text-white w-full'
                    value={search}
                    onChange={handleSearchChange}
                />
            </div>
        </div>
        {isLoading ? (
          <div className='w-full flex items-center mt-10'>
            <Loader />
          </div>
          ) : (
        <div className='flex flex-col px-3 gap-4'>
        {allUser
            .filter((user) => user.id !== loggedUser.id)
            .map((data) => (
              <div key={data.id} className='flex items-center justify-between gap-4'>
                <div className='flex items-center gap-2'>
                  <img src={data.imageUrl || '/images/profile.jpg'} alt='profile' className='w-12 h-12 rounded-3xl' />
                  <p className='text-white'>{data.accountName}</p>
                </div>
                <div className='bg-green px-3 rounded-xl cursor-pointer' onClick={()=>handleView(data.id)}>
                  <p className='text-black'>View</p>
                </div>
              </div>
            ))}
        </div>)}
      </div>
    </div>
  )
}

export default UserSearchBar