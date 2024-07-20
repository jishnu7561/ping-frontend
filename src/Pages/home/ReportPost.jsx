import { initFlowbite } from 'flowbite'
import React, { useEffect, useState } from 'react'
import { Button, Modal } from "flowbite-react";
import request from '../../common/utils/APIs/UserApis';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
function ReportPost({postId}) {
    const [openModal, setOpenModal] = useState(false);
    const {loggedUser} = useSelector((state)=>state.auth)
    // useEffect(()=>{
    //     initFlowbite();
    // })

    const reportOptions = [
        "Nudity or sexual activity",
        "Hate speech or symbols",
        "Violence or dangerous organizations",
        "Bullying or harassment",
        "Scam or fraud",
        "False information",
        "I just don't like it"
      ];

    const [selectedOption, setSelectedOption] = useState('Nudity or sexual activity'); // Default selected option

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const submitHandler =()=>{
    console.log("selected : ",selectedOption)
    setOpenModal(false)
    if(!selectedOption.trim()){
      toast.error("please select ")
      return;
    }
    // alert(postId)
    // alert(selectedOption)
    request("POST","/post/reportPost",
      {
        "postId":postId,
        "reporterId": loggedUser.id,
        "reportDescription":selectedOption
      }
    ).then((response)=>{
      console.log("report post response: ",response.data)
      toast.success(response.data.message);
    }).catch((error)=>{
      console.log("report post error: ",error)
    })  
  }
  return (
    <>
    <div data-modal-target="testid" data-modal-toggle="default-modal" className='flex text-red text-sm items-center px-4 py-2 gap-2 cursor-pointer block'
    onClick={() => setOpenModal(true)}
    >
        <i className="fa-regular fa-message-exclamation"></i>
        <p className="dropdown-item hover:bg-gray ">Report</p>
    </div>
    {/* <div>
    <button onClick={() => setOpenModal(true)} class="block text-white bg-green hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
    Toggle modal
    </button>
    </div> */}

    <Modal show={openModal} onClose={() => setOpenModal(false)} className=''>
        <Modal.Header className='bg-black text-white'>Report Post</Modal.Header>
        <Modal.Body className='bg-black'>
        <div className="space-y-6">
            {reportOptions.map((option, index) => (
            <div key={index} className="flex items-start">
                <div className="flex items-center h-5">
                    <input
                    id={`option${index}`}
                    type="radio"
                    value={option}
                    checked={selectedOption === option}
                    onChange={handleOptionChange}
                    className="w-4 h-4 border border-black rounded bg-grey focus:ring-3 focus:ring-green-500 checked:bg-green-500 dark:bg-grey dark:border-grey dark:focus:ring-green dark:ring-offset-grey dark:focus:ring-offset-grey"                    />
                </div>
                <label htmlFor={`option${index}`} className="ms-2 text-sm font-medium text-white dark:text-gray-300">
                    {option}
                </label>
            </div>
            ))}
        </div>
        </Modal.Body>
        <Modal.Footer className='bg-black border-b-2 border-b-white'>
          <Button className='bg-red border-none text-black cursor-pointer' onClick={submitHandler}>Submit</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
  </>
  )
}

export default ReportPost