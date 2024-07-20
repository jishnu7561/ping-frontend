import React, { useEffect, useState } from 'react'
import request from '../../../common/utils/APIs/UserApis';
import { useNavigate } from 'react-router-dom';

function ReportManagement() {

  const [isVisible, setIsVisible] = useState(false); // State to manage visibility
  const [reportDetails,setReportDetails] = useState([]);
  const navigate = useNavigate();

  // Function to toggle visibility
  const toggleVisibility = () => {
      setIsVisible(!isVisible);
  };

  useEffect(()=>{
    request("GET","/user/api/admin/getReports",{})
    .then((response)=>{
      console.log("report response: ",response.data)
      setReportDetails(response.data)
    }).catch((error)=>{
      console.log("report error: ",error)
    })
  },[])

  return (
    <div className='w-full h-full bg-grey overflow-hidden overflow-y-auto' style={{ '-ms-overflow-style': 'none', 'scrollbar-width': 'none' }}>
  <div className='flex flex-wrap w-full justify-center lg:p-10 '>
    <div className='flex flex-col w-full bg-black lg:p-10 p-5 gap-4 lg:rounded-xl h-screen'>
      <div className='flex flex-col lg:gap-10 gap-3'>
        <div>
            <h2 className='text-white'>All Reports</h2>
        </div>
        {reportDetails.map((details) => ( <div className='flex flex-col w-full rounded-xl gap-2' style={{"backgroundColor":"#202225"}}>
            <div className='flex p-4 items-center gap-4'>
              <i class="fa-solid fa-circle text-red text-xs"></i>
              <div className='flex justify-between gap-5 items-center cursor-pointer' onClick={toggleVisibility}>
                <p className="text-white text-base">
                    <span className="text-white font-bold">{details.reporterName} </span>
                     has submitted a report regarding a post made by
                    <span className="text-white font-bold"> {details.postUserName} </span> 
                </p>
                <i class={`fa-regular ${isVisible? 'fa-angle-up':'fa-angle-down'} text-green`}></i>
              </div>
            </div>
            {isVisible && <div className='flex gap-2'>
              <div className='flex px-11 overflow-hidden rounded-md pb-4'>
                <img src={details.postImage} alt="" className='object-full w-54 h-28' />
              </div>
              <div className='flex flex-col gap-2'>
                <p className="text-white text-base">
                    <span className="text-white font-bold pr-5">Reason :</span>
                     {details.reportDescription}
                    {/* <span className="text-white font-bold"> user2 </span>  */}
                </p>
                <p className='text-white'>[April 2 2024]</p>
                <button className='bg-green rounded-xl font-medium mt-3 py-1' onClick={() => navigate(`/admin/user-post/${details.postId}/${details.reportId}`)}>View</button>
              </div>
            </div>}
        </div>
        ))}
        {/* <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-white">
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
        </table> */}
        {/* </div> */}
      </div>
      {reportDetails?.length < 1 && 
         (<div className='text-white flex w-full items-center justify-center h-full'>
          <p className='text-3xl'>No reports found</p>
         </div>)}
    </div>
  </div>
</div>
  )
}

export default ReportManagement