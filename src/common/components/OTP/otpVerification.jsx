import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import request from '../../utils/APIs/UserApis'; // Adjust the import based on your project structure
import { toast } from 'sonner';

function OTP() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    if (timer === 0) {
      clearInterval(timer);
      setError('The verification code has expired')
      setIsActive(false);
    }
  }, [timer]);

  const validateOtp = () => {
    if ((otp).length < 1) {
      setError('please enter you OTP');
      return false;
    }
    setError('');
    return true;
  };

  // const requestOtp = async () => {
    // if (!validatePhoneNumber()) {
    //   return;
  //   }
  //   setLoading(true);
  //   try {
  //     const response = await request('POST', '/user/api/auth/request-otp', { phoneNumber });
  //     setLoading(false);
  //     if (response.data?.message) {
  //       const message = response.data.message;
  //       if (message.includes('OTP sent')) {
  //         toast.success('OTP sent successfully');
  //         setOtpSent(true);
  //       } else {
  //         toast.error(message);
  //         setError(message);
  //       }
  //     } else {
  //       setError('Unexpected response format');
  //     }
  //   } catch (error) {
  //     console.error('Error:', error.response || error.message || error);
  //     setLoading(false);
  //     setError('An error occurred. Please try again.');
  //   }
  // };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateOtp()) {
      return;
    }
    setLoading(true);
    try {
      const response = await request('POST', '/user/api/auth/otpVerification', 
                { otp:otp });
      setLoading(false);
      console.log(response)
      if (response.data?.message) {
        const message = response.data.message;
        if (message.includes('OTP verification successful!')) {
          toast.success(message);
          navigate('/login'); // Redirect to the desired page after successful authentication
        } else {
          toast.error(message);
          setError(message);
        }
      } else {
        setError('Unexpected response format');
      }
    } catch (error) {
      console.error('Error:', error.response || error.message || error);
      setLoading(false);
      setError('An error occurred. Please try again.');
    }
  };

  const resend = async (e) => {
    
    setIsActive(false)
    setLoading(true);
    try {
      const response = await request('GET', '/user/api/auth/resend-otp');
      setLoading(false);
      console.log(response)
      if (response.data?.message) {
        const message = response.data.message;
        if (message.includes('Success')) {
          toast.success(response.data.description);
        } else {
          toast.error(message);
          setError(message);
        }
      } else {
        setError('Unexpected response format');
      }
    } catch (error) {
      console.error('Error:', error.response || error.message || error);
      setLoading(true);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="otp-container h-dvh bg-gray-100 flex items-center justify-center bg-black">
      <div className="otp-form lg:w-1/4 w-11/12 max-w-md p-6 rounded-3xl shadow-md border-solid border-green border-2">
        <div className="text-center">
          <img className="mx-auto h-15 w-28" src="/images/ping.jpeg" alt="Your Logo" />
        </div>
        <form className="space-y-3">
          <div className="flex flex-col">
            <input
              id="otp"
              name="otp"
              type="number"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="bg-grey rounded-3xl pl-8 p-3 w-full border border-gray-300 focus:outline-none"
            />
          </div>
          {error && <p className="text-center" style={{ color: 'red' }}>{error}</p>}
            <button
              type="button"
              // disabled={!isActive}
              onClick={submitHandler}
              className="rounded-3xl block w-full mt-3 p-3 text-center font-medium text-lg"
              style={{ backgroundColor: 'green', color: 'black', marginTop: '30px' }}
            >
              {loading ? (
                <img
                  src="images/loader.svg"
                  alt="Loading..."
                  className="w-5 h-5 mx-auto"
                />
              ) : (
                <span>Request OTP</span>
              )}
            </button>
          <div className='flex justify-center'>
            <span className='text-white text-sm'>
              {/* Didn't receive an OTP?{' '}
              <span className='text-green cursor-pointer' onClick={requestOtp}>
                Resend OTP */}
                
              {/* </span> */}
              {timer === 0 ? (
            <p>
              Didn't receive code?{" "}
              <a
                onClick={resend}
                className="font-medium text-indigo-500 hover:text-indigo-600 cursor-pointer"
              >
                Resend
              </a>
            </p>
          ) : (
            <p>Resend code in {timer} seconds</p>
          )}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OTP;
