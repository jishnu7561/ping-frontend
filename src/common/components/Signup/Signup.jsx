import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import request, { setAuthToken } from '../../utils/APIs/UserApis';
import Swal from 'sweetalert2';
import { toast } from 'sonner';

function Signup() {

    const navigate = useNavigate();

    const [fullname ,setFullname] = useState('')
    const [username ,setUsername] = useState('')
    const [email ,setEmail] = useState('')
    const [password ,setPassword] = useState('')
    const [confirmPassword ,setConfirmPassword] = useState('')

    const [error,setError] = useState("");
    const [loading,setLoading] = useState(false);

    const validateForm = () => {
      // Validation for each field
      if (fullname.length < 4) {
          setError('Fullname must be at least 4 characters')
        return false;
      }
    
      if (username.length < 3) {
          setError('Username must be at least 4 characters')
        return false;
      }
    
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          setError('Invalid email address')
        return false;
      }
    
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


    const submitHandler = async (e) => {
      e.preventDefault();
      console.log("clicked");
      setAuthToken(null);
      if (!validateForm()) {
        return;
      }
      setLoading(true);
      try {
        const response = await request("POST", "/user/api/auth/register", {
          fullName: fullname,
          accountName: username,
          email: email,
          password: password,
        });
        console.log(response);
        setLoading(false);
        if (response.data?.message) {
          const message = response.data.message;
          if (message.includes("Success")) {
            toast.success("successfully signed up")
            navigate("/otp-verification");
          } else if (message.includes("Email already exists")) {
            // setError(message);
            toast.error(message)
            setEmail("");
          } else if (message.includes("Username already exists")) {
            toast.error(message)
            // setError(message);
            setUsername("");
          } else {
            toast.error(message)
            setError(message);
          }
        } else {
          setError("Unexpected response format");
        }
      } catch (error) {
        console.error("Error:", error);
        setFullname("");
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    };
    

  return (
    <div className="h-dvh bg-gray-100 flex items-center justify-center bg-black">
      <div className="lg:w-1/4 w-11/12 p-2 max-w-md lg:p-6 rounded-3xl shadow-md border-solid border-green border-2">
        <div className="text-center">
          <img className="mx-auto h-15 w-28" src="/images/ping.jpeg" alt="Your Logo" />
        </div>
        <form className="space-y-3">
        <div className="flex flex-col">
            {/* <label className="text-sm font-medium text-gray-700 mb-2" htmlFor="fullname">
              Fullname
            </label> */}
            <input
              id="fullname"
              name="fullname"
              type="fullname"
              value={fullname}
              // autoComplete="email"
              onChange={(e)=>{setFullname(e.target.value)}}
              required
              placeholder='Fullname'
              className="bg-grey pl-8 shadow-sm rounded-3xl p-3 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full"
            />
          </div>
          <div className="flex flex-col">
            {/* <label className="text-sm font-medium text-white mb-2" htmlFor="username">
              Username
            </label> */}
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              placeholder='Username'
              onChange={(e)=>{setUsername(e.target.value)}}
              // autoComplete="username"
              required
              className="bg-grey p-3 pl-8 focus:outline-none w-full rounded-3xl focus:bg-inherit"
            />
          </div>
          <div className="flex flex-col">
            {/* <label className="text-sm font-medium text-gray-700 mb-2" htmlFor="email">
              Email Address
            </label> */}
            <input
              id="email"
              name="email"
              type="email"
              placeholder='Email'
              value={email}
              onChange={(e)=>{setEmail(e.target.value)}}
              // autoComplete="email"
              required
              className="bg-grey rounded-3xl pl-8 shadow-sm p-3 border border-gray-300 focus:outline-none w-full"
            />
          </div>
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
          {error && <p className="text-center" style={{"color":"red"}}>{error}</p> }
          <button
            type="submit"
            className="rounded-3xl block w-full mt-3 p-3 text-center font-medium text-lg bg-green" style={{backgroundColor:'green',color:'black',marginTop:"30px"}} 
            onClick={submitHandler}
            disabled={loading}>
             {loading ? (
        <img
          src="images/loader.svg" // Replace with your loading image path
          alt="Loading..."
          className="w-5 h-5 mx-auto" // Adjust image size and position as needed
        />
      ) : (
        <span>Sign Up</span>
      )}
          </button>
          <div className='flex justify-center'>
            <span className='text-white text-sm'>Already have an account ?<span className='text-green cursor-pointer' onClick={()=>navigate("/login")}> Login</span></span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup


