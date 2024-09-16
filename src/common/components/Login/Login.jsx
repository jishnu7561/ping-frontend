import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import request, { setAuthToken } from '../../utils/APIs/UserApis';
import { setLoggedUser } from '../../../Redux/Slices/AuthSlice';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email,setEmail] = useState();
  const [password,setPassword] = useState();
  const [error,setError] = useState();
  const [loading,setLoading] =useState(false)

  const validateForm = () => {
    // Validation for each field
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Invalid email address')
      return false;
    }
  
    if (password.length < 4) {
        setError('Password must be at least 4 characters')
      return false;
    }
    setError('');
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
      const response = await request("POST", "/user/api/auth/authenticate", {
        email: email,
        password: password,
      });
      console.log(response);
      setLoading(false);
      if (response.data) {
        const message = response.data.message;
        if (response.data.jwtToken) {
          toast.success("successfully logined up")
          dispatch(setLoggedUser(response.data.user));
          setAuthToken(response.data.jwtToken);
          response.data.user.role === 'ADMIN' ? navigate("/admin/users") : navigate("/");
        } 
        else {
          if(message === "account is blocked"){
            toast.error("Your account has been blocked. Check your email for details.")
            setError(message);
            return;
          }
          toast.error(message)
          setError(message);
        }
      } else {
        setError("Unexpected response format");
      }
    } catch (error) {
      console.error("Error:", error);
      setEmail("");
      setPassword("");
    }
  };

  const handlGoogleAuth = async (credential) => {
    try {
      const response = await axios.post('https://cravehub.online/user/api/auth/google', {
        token: credential
      });
      if (response.data) {
        const message = response.data.message;
        if (response.data.jwtToken) {
          toast.success("successfully logined up")
          dispatch(setLoggedUser(response.data.user));
          setAuthToken(response.data.jwtToken);
          response.data.user.role === 'ADMIN' ? navigate("/admin/users") : navigate("/");
        } 
        else {
          toast.error(message)
          setError(message);
        }
      } else {
        setError("Unexpected response format");
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      console.error('Error during authentication:', error);
    }
  };

  const handleForgotPassword =() =>{
    navigate("/forgot-password");
  }


  return (
    <div className="login-container h-dvh  flex items-center justify-center bg-black ">
      <div className="login-form lg:w-1/4 w-11/12 max-w-md p-6 rounded-3xl shadow-md border-solid border-green border-2">
        <div className="text-center">
          <img className="mx-auto h-15 w-28" src="/images/ping.jpeg" alt="Your Logo" />
        </div>
        <form className="space-y-3">
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
          <div className="flex flex-col">
            {/* <label className="text-sm font-medium text-gray-700 mb-2" htmlFor="password">
              Password
            </label> */}
            <input
              id="password"
              name="password"
              type="password"
              placeholder='Password'
              // autoComplete="current-password"
              value={password}
              onChange={(e)=>{setPassword(e.target.value)}}
              required
              className="bg-grey rounded-3xl pl-8  p-3 w-full border border-gray-300 focus:outline-none"
            />
          </div>
          <div className='flex flex-row-reverse w-full'>
            <p className='text-white text-xs' onClick={handleForgotPassword}>forgot password?</p>
          </div>
          {error && <p className="text-center" style={{"color":"red"}}>{error}</p> }
          <button
            type="submit"
            disabled={loading}
            onClick={submitHandler}
            className="rounded-3xl block w-full mt-3 p-3 text-center font-medium text-lg" style={{backgroundColor:'green',color:'black',marginTop:"30px"}}>
           {loading ? (
        <img
          src="images/loader.svg" // Replace with your loading image path
          alt="Loading..."
          className="w-5 h-5 mx-auto" // Adjust image size and position as needed
        />
      ) : (
        <span>Sign In</span>
      )}
          </button>
          <div className='flex justify-center'>
            <span className='text-white text-sm'>Didnt have an account yet?<span className='text-green cursor-pointer' onClick={()=>navigate("/signup")}> Signup</span></span>
          </div>
        </form>
        <div className="flex justify-center pt-3">
          <GoogleLogin
          onSuccess={(credentialResponse) => {
          if (credentialResponse.credential) {
          handlGoogleAuth(credentialResponse.credential);
          }
          }}
          onError={() => {
          toast.error("Login Failed");
          }}
          />
          </div>
      </div>
    </div>
  )
}

export default Login