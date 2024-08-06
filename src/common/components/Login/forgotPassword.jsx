import React, { useState } from 'react'
import request from '../../utils/APIs/UserApis';
import { toast } from 'sonner';

function ForgotPassword() {
    const [email,setEmail] = useState('');
    const [error,setError] = useState('');
    const [loading,setLoading] = useState(false)

    const validateForm = () => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Invalid email address')
          return false;
        }
        return true;
      };

    const submitHandler=()=>{
        if (!validateForm()) {
            return;
          }
        setLoading(true);
        request("POST",`/user/api/auth/forgot-password?email=${email}`,{})
        .then((response)=>{
            setLoading(false)
            console.log("forgot-password response: ",response)
            toast.success("Reset Link send to your email")
            setEmail('');
        }).catch(()=>{
            console.log("forgot-password error: ",error)
            setEmail('');
        })
    }

  return (
    <div className="otp-container h-dvh bg-gray-100 flex items-center justify-center bg-black">
    <div className="otp-form lg:w-1/4 w-11/12 max-w-md p-6 rounded-3xl shadow-md border-solid border-green border-2">
      <div className="text-center">
        <img className="mx-auto h-15 w-28" src="/images/ping.jpeg" alt="Your Logo" />
      </div>
      <form className="space-y-3">
        <p className='text-green text-xs'>Submit the email which you have used on account creation !!</p>
      <div className=" flex flex-col">
            {/* <label className="text-sm font-medium text-gray-700 mb-2" htmlFor="email">
              Email Address
            </label> */}
            <input
              id="email"
              name="email"
              type="email"
              placeholder='Email'
              // autoComplete="email"
              value={email}
              onChange={(e)=>{setEmail(e.target.value)}}
              required
              className="bg-grey rounded-3xl pl-8  p-3 w-full border border-gray-300 focus:outline-none"
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
              <span>Submit</span>
            )}
          </button>
      </form>
    </div>
  </div>
  )
}

export default ForgotPassword