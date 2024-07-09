import React, { useEffect, useState } from 'react'
import request from '../../utils/APIs/UserApis';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { updateLoggedUser } from '../../../Redux/Slices/AuthSlice';

function Subscription() {
    const {loggedUser} = useSelector((state)=>state.auth)
    const [isExpired, setIsExpired] = useState(loggedUser.subscribed);
    const dispatch = useDispatch();

    // Mock subscription end date for demonstration
    const subscriptionEndDate = loggedUser.subscriptionEndDate || null;

    useEffect(() => {
        if(subscriptionEndDate != null){
            console.log("isexpired: ",checkSubscriptionExpiry(subscriptionEndDate))
            
            setIsExpired(!checkSubscriptionExpiry(subscriptionEndDate))
        }
        request("GET",
            `/user/api/secure/getUserDetails/${loggedUser.id}`,
            {}
        ).then((response)=>{
            console.log(response.data)
            dispatch(updateLoggedUser({
                subscribed:response.data.subscribed,
                subscriptionEndDate:response.data.subscriptionEndDate
            }))
        })
    }, [subscriptionEndDate]);

    
      const checkSubscriptionExpiry = (subscriptionEndDateStr, timeZone = 'UTC')=> {
        const subscriptionEndDateIso = subscriptionEndDateStr.replace(" ", "T");
        const subscriptionEndDate = new Date(subscriptionEndDateIso);
        const currentDate = new Date();
        return currentDate > subscriptionEndDate;
        }

    function handleSubscription() {
            request("POST",
                "/user/api/secure/subscription/create-subscription-intent",{}
              ).then((response)=>{
                console.log("url: ",response.data)
                  window.location.href=response.data;
              }).catch((error)=>{
                  toast.error(error);
              })
            // toast.success("subscribing")
    }

    const [isVisible, setIsVisible] = useState(false); // State to manage visibility

    // Function to toggle visibility
    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    return (
        <div className='flex flex-col text-white text-sm items-start px-4 py-2 gap-2 cursor-pointer'>
            <div className='flex justify-between gap-4 items-center cursor-pointer' onClick={toggleVisibility}>
                <div className='flex text-white text-sm items-center  gap-2 '>
                    <i className="fa-sharp fa-solid fa-badge-check text-base text-green"></i>
                    <p
                    className="dropdown-item hover:bg-gray"
                    >
                    Blue-tick subscription
                    </p>
                </div>
                <i class={`fa-regular ${isVisible? 'fa-angle-up':'fa-angle-down'} text-green`}></i>
            </div>
            <div
                className={`details text-white mt-2 p-2 bg-gray-800 rounded transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{ display: isVisible ? 'block' : 'none' }}
            >
            {isExpired?
            (
            <div className="flex flex-col gap-3 subscription-info p-2 bg-light_gray shadow-md rounded-md">
                <p className="text-gray-800 font-semibold mt-2">
                Subscription Details: Your subscription is active until
                <span className="text-green font-bold"> {subscriptionEndDate} </span>
                </p>
            </div>
            ):
            ( <div className="flex flex-col gap-3 subscription-info p-2 bg-light_gray shadow-md rounded-md">
                <p className="text-gray-800 font-semibold mt-2">
                    Unlock exclusive features, gain enhanced visibility, and stand out with our prestigious 
                    <span className="text-green font-bold"> Blue-tick subscription </span>
                    for only 
                    <span className="text-green font-bold"> $600 </span> 
                    per month. Elevate your profile to new heights with premium benefits that ensure you get noticed!
                </p>
                <p className='text-center bg-green p-1 rounded-lg' onClick={handleSubscription}>Subscribe</p>

            </div>)}
            </div>
        </div>
    );
}

export default Subscription