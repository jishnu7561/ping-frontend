
import React, { useEffect, useRef, useState } from 'react'
import ChartComponent from './chartComponent'
import request from '../../../common/utils/APIs/UserApis'


function DashboardManagement() {

    const [reports,setReports] = useState();

    useEffect(()=>{
        request("GET","/user/api/admin/reports",{})
        .then((response)=>{
            console.log("dashboard reports: ",response)
            setReports(response.data)
        }).catch((error)=>{
            console.log(error);
        })
    },[])

    const formatNumber = (number) => {
        return number < 10 && number>0 ? `0${number}` : number;
      };


  return (
    <div className='w-full h-full bg-grey'>
        <div className='flex flex-wrap w-full justify-center lg:p-10 gap-4'>
            <div className='flex justify-around w-full lg:p-5 p-5 gap-4'>
                <div className='w-[30%] h-40 bg-black rounded-xl flex p-4'>
                    <div className='flex flex-col w-full'>
                        <div className="flex items-center w-full gap-2">
                            <i className="text-xs fa-solid fa-circle text-blue mr-2"></i>
                            <p className='text-base text-white'>Total Users</p>
                        </div>
                        <div className='flex gap-4 items-center justify-center h-full'>
                            <p className='text-white text-6xl'>{formatNumber(reports?.totalUsers)}</p>
                            <i class="fa-thin fa-user text-blue text-6xl"></i>
                        </div>
                    </div>
                </div>

                <div className='w-[30%] h-40 bg-black rounded-xl flex p-4'>
                    <div className='flex flex-col w-full'>
                        <div className="flex items-center w-full gap-2">
                            <i className="text-xs fa-solid fa-circle text-pink mr-2"></i>
                            <p className='text-base text-white'>Total Posts</p>
                        </div>
                        <div className='flex gap-4 items-center justify-center h-full'>
                            <p className='text-white text-6xl'>{formatNumber(reports?.totalPosts)}</p>
                            <i class="fa-thin fa-camera text-pink text-6xl"></i>
                        </div>
                    </div>
                </div>
                <div className='w-[30%] h-40 bg-black rounded-xl flex p-4'>
                    <div className='flex flex-col w-full'>
                        <div className="flex items-center w-full gap-2">
                            <i className="text-xs fa-solid fa-circle text-red mr-2"></i>
                            <p className='text-base text-white'>Blocked Users</p>
                        </div>
                        <div className='flex gap-4 items-center justify-center h-full'>
                            <p className='text-white text-6xl'>{formatNumber(reports?.blockedUsers)}</p>
                            <i class="fa-thin fa-user-xmark text-red text-6xl"></i>
                        </div>
                    </div>
                </div>
            </div>
            <ChartComponent />
        </div>
    </div>
  )
}

export default DashboardManagement