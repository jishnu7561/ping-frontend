import React,{useEffect,useState} from 'react'
import { Link } from 'react-router-dom'
import request from '../../../common/utils/APIs/UserApis';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';


function UserManagement() {

    const {loggedUser} = useSelector((state) => state.auth);
    const [alluser, setAllusers] = useState([]);

    // const manageBlcok = async () => {
    //     const response = await blockUser(loggedUser.id);
    //     console.log(response);
    
    //     if (response.status) {
    //       setAllusers(response.users);
    //     }
    //   };

    const manageBlock = async (id) => {
      console.log("clicked");
      try {
        const response = await request("GET", `/user/api/admin/block-user/${id}`, {});
        console.log(response);
        if (response.data?.message) {
          const message = response.data.message;
          if (message.includes("Success")) {
            toast.success("successfully edited");
            // Update the user status in the alluser array
            setAllusers((prevUsers) => {
              return prevUsers.map(user => {
                if (user.id === id) {
                  console.log('User found:', user);
                  return { ...user, blocked: !user.blocked }; // Toggle the enabled status
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
    };


    useEffect(() => {
        request(
            "GET",
            "/user/api/admin/getAllUsers",
            {}
        )
        .then(response => {
            console.log('Received data:', response.data);
            setAllusers(response.data)
            console.log(alluser)
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }, [loggedUser.id]);
    
  return (
    <div className='w-full h-full bg-grey'>
  <div className='flex flex-wrap w-full justify-center lg:p-10 '>
    <div className='flex flex-col w-full bg-black lg:p-10 p-5 gap-4 lg:rounded-xl'>
      <div className='flex flex-col lg:gap-10 gap-3'>
        <div>
            <h2 className='text-white'>Users List</h2>
        </div>
        <div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-white">
          <thead className="text-xs text-white uppercase ">
            <tr>
              <th scope="col" className="px-6 py-3">
                User Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Verification status
              </th>
              <th scope="col" className="px-6 py-3">
                Block /UnBlock
              </th>
            </tr>
          </thead>
          <tbody>
            {alluser?.map((user) => {
              return (
                <tr key={user.id} className=" border-b dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-white whitespace-nowrap dark:text-white"
                  >
                    {user.fullName}
                  </th>
                  <td className="px-6 py-4 text-white">{user.email}</td>
                  <td className="px-6 py-4 text-white">{user.role}
                    {/* {user.username !== 0 ? (
                      <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                        verified
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
                        not Verified
                      </span>
                    )} */}
                  </td>
                  {user.role === 'USER' ?
                    <td className="px-6 py-4">
                    <a
                      onClick={() => manageBlock(user.id)}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      {user.blocked === false ? <button type="button" onClick={()=>manageBlock(user._id)} className="text-white bg-red bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Block</button> 
                                : <button type="button" onClick={()=>manageBlock(user._id)} className="text-white bg-green bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">unBlock</button>}

                    </a>
                  </td>
                  :
                  <td className="px-6 py-4"></td>
                  }
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  </div>
</div>
  )
}

export default UserManagement