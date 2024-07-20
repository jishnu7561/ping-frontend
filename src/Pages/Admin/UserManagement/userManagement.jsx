import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import request from '../../../common/utils/APIs/UserApis';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import Swal from 'sweetalert2';

function UserManagement() {
    const { loggedUser } = useSelector((state) => state.auth);
    const [alluser, setAllusers] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchUsers = (search = '', page = 0) => {
        request(
            "GET",
            `/user/api/admin/getAllUsersOnSearch?search=${search}&page=${page}`,
            {}
        )
        .then(response => {
            setAllusers(response.data.content);
            setTotalPages(response.data.totalPages);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    };

    useEffect(() => {
        fetchUsers(search, page);
    }, [search, page, loggedUser.id]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const manageBlock = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this action!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, proceed!",
            cancelButtonText: "Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await request("GET", `/user/api/admin/block-user/${id}`, {});
                    if (response.data?.message) {
                        const message = response.data.message;
                        if (message.includes("Success")) {
                            toast.success("successfully edited");
                            setAllusers((prevUsers) => {
                                return prevUsers.map(user => {
                                    if (user.id === id) {
                                        return { ...user, blocked: !user.blocked };
                                    }
                                    return user;
                                });
                            });
                        } else {
                            toast.error(message);
                        }
                    } else {
                        console.error("Unexpected response format");
                    }
                } catch (error) {
                    console.error("Error:", error);
                }
            }
        });
    };

    return (
        <div className='w-full h-full bg-grey'>
            <div className='flex flex-wrap w-full justify-center lg:p-10 '>
                <div className='flex flex-col w-full bg-black lg:p-10 p-5 gap-4 lg:rounded-xl'>
                    <div className='flex justify-center items-center mx-5 my-4'>
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
                    <div className='flex flex-col lg:gap-10'>
                        {/* <div>
                            <h2 className='text-white'>Users List</h2>
                        </div> */}
                        <div>
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-white">
                                <thead className="text-xs text-white uppercase">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">User Name</th>
                                        <th scope="col" className="px-6 py-3">Email</th>
                                        <th scope="col" className="px-6 py-3">Verification status</th>
                                        <th scope="col" className="px-6 py-3">Block /UnBlock</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {alluser?.map((user) => (
                                        <tr key={user.id} className="border-b dark:bg-gray-800 dark:border-gray-700">
                                            <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap dark:text-white">
                                                {user.fullName}
                                            </th>
                                            <td className="px-6 py-4 text-white">{user.email}</td>
                                            <td className="px-6 py-4 text-white">{user.role}</td>
                                            {user.role === 'USER' ?
                                                <td className="px-6 py-4">
                                                    <a onClick={() => manageBlock(user.id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                                        {user.blocked === false ? 
                                                            <button type="button" className="text-white bg-red bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Block</button> 
                                                            : 
                                                            <button type="button" className="text-white bg-green bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">unBlock</button>
                                                        }
                                                    </a>
                                                </td>
                                                :
                                                <td className="px-6 py-4"></td>
                                            }
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className='flex justify-center items-center mt-4'>
                                <button 
                                    onClick={() => handlePageChange(page - 1)} 
                                    disabled={page === 0}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Previous
                                </button>
                                <span className='text-white mx-4'>{page + 1} / {totalPages}</span>
                                <button 
                                    onClick={() => handlePageChange(page + 1)} 
                                    disabled={page === totalPages - 1}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserManagement;
