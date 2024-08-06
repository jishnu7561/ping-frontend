import React, { useEffect, useState } from 'react'
import request from '../../utils/APIs/UserApis';
import { useNavigate, useParams} from 'react-router-dom';
import { toast } from 'sonner';

function ResetPassword() {

    const [password ,setPassword] = useState('')
    const [confirmPassword ,setConfirmPassword] = useState('')
    
    const [error,setError] = useState('');
    const [loading,setLoading] = useState(false)
    const [message,setMessage] = useState('')
    const [isValid,setIsValid] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();

    const validateForm = () => {
        if (password.length < 4) {
            setError('Password must be at least 4 characters')
          return false;
        }
        if (confirmPassword.length < 4) {
          setError('Password must be at least 4 characters')
          return false;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          return false; 
        }
        setError("")
        return true;
      };

      useEffect(()=>{
        
        const verifyToken = async () => {
            try {
              const response = await request("GET",`/user/api/auth/verify-token/${token}`,{});
              if (response.data.message !== "Token is valid") {
                setMessage("Invalid or expired token");
                toast.error("Invalid or expired token")
                setIsValid(true)
              } else{
                setIsValid(false);
                console.log(response)
              }
            } catch (error) {
              setMessage("Invalid or expired token");
            }
          };
          verifyToken();
      },[token])

    const submitHandler= async()=>{
        if (!validateForm()) {
            return;
          }
          alert()
        setLoading(true);
        try{
            const response = await request("POST",`/user/api/auth/reset-password?password=${password}&token=${token}`,{})
            console.log("reset-password response:",response)
            if(response.data.message === "success"){
                toast.success("password changed successfully")
                navigate("/login");
            } else{
                toast.error(response.data.message);
            }
        } catch(error) {
            setMessage(error.response.data);
        }
    }

  return (
    <div className="otp-container h-dvh bg-gray-100 flex items-center justify-center bg-black">
    {isValid ?
    (<div className='flex gap-4'>
        <p className='text-green'>The token is expired or not valid, please try again later</p>
        <button
            type="button"
            onClick={submitHandler}
            className="rounded-3xl block w-full mt-3 p-3 text-center font-medium text-lg"
            style={{ backgroundColor: 'green', color: 'black', marginTop: '30px' }}
          >Go back</button>
    </div>):
    (<div className="otp-form lg:w-1/4 w-11/12 max-w-md p-6 rounded-3xl shadow-md border-solid border-green border-2">
      <div className="text-center">
        <img className="mx-auto h-15 w-28" src="/images/ping.jpeg" alt="Your Logo" />
      </div>
      <form className="space-y-3">
        <div className="flex flex-col">
            {/* <label className="text-sm font-medium text-gray-700 mb-2" htmlFor="password">
              Password
            </label> */}
            <input
              id="password"
              name="password"
              type="password"
              placeholder='Password'
              value={password}
              onChange={(e)=>{setPassword(e.target.value)}}
              // autoComplete="current-password"
              required
              className="bg-grey rounded-3xl pl-8 shadow-sm p-3 border border-gray-300 focus:outline-none  w-full"
            />
          </div>
          <div className="flex flex-col">
            {/* <label className="text-sm font-medium text-gray-700 mb-2" htmlFor="confirm_password">
              Confirm Password
            </label> */}
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder='Confirm Password'
              value={confirmPassword}
              onChange={(e)=>{setConfirmPassword(e.target.value)}}
              // autoComplete="current-password"
              required
              className="bg-grey rounded-3xl pl-8 shadow-sm p-3 border border-gray-300 focus:outline-none w-full"
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
                src="/images/loader.svg"
                alt="Loading..."
                className="w-5 h-5 mx-auto"
              />
            ) : (
              <span>Submit</span>
            )}
          </button>
      </form>
    </div>)}
  </div>
  )
}

export default ResetPassword