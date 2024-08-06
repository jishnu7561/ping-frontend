import React, { useEffect, useState } from 'react'
import request from '../../../common/utils/APIs/UserApis';
import { useNavigate } from 'react-router-dom';
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import { toast } from 'sonner';

function ReportManagement() {

  const [isVisible, setIsVisible] = useState(false); // State to manage visibility
  const [reportDetails,setReportDetails] = useState([]);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [response, setResponse] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);

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

  const handleSubmit = ()=>{
    console.log("select report: ",selectedReport)
    const encodedResponse = encodeURIComponent(response);
    if(selectedReport != null ){
    request("POST",`/user/api/admin/send-response?reporterId=${selectedReport.reporterId}&response=${response}&userName=${selectedReport.postUserName}`,{})
    .then((response)=>{
      console.log("send response: ",response)
      toast.success(response.data.message);
      setResponse('')
      setOpenModal(false);
    }).catch((error)=>{
      console.log("send response error: ",error)
      toast.error("Internal server errror, please try again.")
      setResponse('')
      setOpenModal(false);
    })
  }
  }

  const handleRespondClick =(details)=>{
    setOpenModal(true);
    setSelectedReport(details)
  }

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
                <p className='text-white'>{details.createdAt}</p>
                <button className='bg-green rounded-xl font-medium mt-1 py-1' onClick={() => navigate(`/admin/user-post/${details.postId}/${details.reportId}`)}>View</button>
                <button className='bg-green rounded-xl font-medium mt-1 mb-3 py-1' onClick={()=>handleRespondClick(details)}>Respond</button>
              </div>
            </div>}   
        </div>
        ))}


      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            {/* <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" /> */}
            <h3 className="text-lg font-normal text-gray-500 dark:text-gray-400">
              Send reponse to the reported user.
            </h3>
            <div className='pb-8 pt-5'>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Enter your response" />
              </div>
              <TextInput
                id="response"
                placeholder="response"
                value={response}
                onChange={(event) => setResponse(event.target.value)}
                required
              />
            </div>
            <div className="flex justify-center gap-4">
              <Button className='bg-red border-none text-black cursor-pointer' onClick={handleSubmit}>
                {"Yes, I'm sure"}
              </Button>
              <Button className='bg-white text-black cursor-pointer border-black' onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
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