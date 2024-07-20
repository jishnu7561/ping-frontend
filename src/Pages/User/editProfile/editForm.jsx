import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import request from '../../../common/utils/APIs/UserApis';
import { toast } from 'sonner';
import { useState,useEffect ,useRef} from 'react';
import { Link } from 'react-router-dom';
import { updateLoggedUser } from '../../../Redux/Slices/AuthSlice';



function EditForm() {

    const {loggedUser} = useSelector((state) => state.auth);

    const [fullname ,setFullname] = useState('')
    const [username ,setUsername] = useState('')
    const [email ,setEmail] = useState('')
    const [bio ,setBio] = useState('')
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState();
    const [imageSrc, setImageSrc] = useState(loggedUser.imageUrl);
    const [image,setImage] = useState();
    const dispatch = useDispatch();
    // const[userData,setUserData] = useState({
    //     id:"",
    //     firstName:"",
    //     lastName:"",
    //     email:""
    // });
    


    useEffect(() => {
        request(
            "GET",
            `/user/api/secure/getUserDetails/${loggedUser.id}`, 
            {}
        )
        .then(response => {
            console.log('Received data:', response.data);
            setFullname(response.data.fullName);
            setUsername(response.data.accountName);
            setEmail(response.data.email);
            setBio(response.data.bio);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }, [loggedUser.id]);


    const submitHandler = async (e) => {
        e.preventDefault();
        console.log("clicked");
        // setAuthToken(null);
        if (!validateForm()) {
          return;
        }
        setLoading(true);
        try {
          const response = await request("POST", `/user/api/secure/update-profile/${loggedUser.id}`, {
            fullName: fullname,
            accountName: username,
            email: email,
            bio: bio,
          });
          console.log(response);
          setLoading(false);
          if (response.data?.message) {
            const message = response.data.message;
            if (message.includes("Success")) {
              toast.success("successfully edited")
              dispatch(updateLoggedUser({
                fullName: fullname,
                accountName: username,
                email: email,
                bio: bio,
              }))
            } 
             else {
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

        }
      };


  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const validImageTypes = ['image/png', 'image/jpeg'];
    
      if (!validImageTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid image (png/jpeg).`);
        return;
      }

    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result); // Update the image source
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  const uploadImage = (e) => {
    if(imageSrc == null){
        console.log("please select any image")
        toast.error("please select any image");
        return;
    }

    request(
        "POST",
        "/user/api/secure/uploadImage",
        {   
            id:loggedUser.id,
            file:image
        }
    ).then((response)=>{
        console.log(response.data)
        toast.success("successfully updated")
        dispatch(updateLoggedUser({
          imageUrl:response.data.description
        }))
    }).catch((error)=>{
        console.log(error);
    })
}

const validateForm = () => {
  // Validation for each field
  if (!fullname.trim() || fullname.length < 4) {
      toast.error('Fullname must be at least 4 characters')
    return false;
  }

  if (!username.trim() || username.length < 3) {
    toast.error('Username must be at least 4 characters')
      return false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    toast.error('Invalid email address')
    return false;
  }
  if (!bio.trim()) {
    toast.error('Bio must be filled');
    return false; 
  }
  return true;
};


  return (
    <div className='w-full h-full lg:bg-grey bg-black overflow-y-auto' style={{ '-ms-overflow-style': 'none', 'scrollbar-width': 'none' }}>
    <div className='flex flex-wrap w-full justify-center lg:p-10 pb-20'>
      <div className='flex flex-col w-full gap-10 bg-black lg:p-10 p-5 pt-10 gap-8 lg:rounded-xl '>
        <div className='flex gap-2 items-center'>
            <i class="fa-thin fa-user-pen text-white text-2xl"></i>
            <h2 className='text-white font-semibold'>Edit Profile</h2>
          </div>
        <div className='w-full flex justify-center'>
          <div className='flex flex-col justify-center lg:w-[40%] lg:gap-16 gap-10'>
            <div className='flex flex-col items-center gap-2'>
              <div className='flex justify-center'>
                  <img 
                    src={imageSrc || "/images/profile.jpg"}
                    alt="profile" 
                    className='h-20 w-24 lg:h-24 lg:w-24 rounded-full cursor-pointer' 
                    onClick={handleImageClick} 
                  />
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  onChange={handleFileChange} 
                />
               </div> 
              <button className='bg-green p-2 rounded-xl w-[50%]' onClick={uploadImage}>upload</button>
            </div>
            <form className="space-y-3 lg:pb-20 pb-10">
                <div className="flex flex-col justify-center gap-1">
                    <label className="text-sm font-medium text-white me-2" htmlFor="fullname">
                    Fullname:
                    </label>
                    <input
                    id="fullname"
                    name="fullname"
                    type="fullname"
                    value={fullname}
                    onChange={(e)=>{setFullname(e.target.value)}}
                    required
                    placeholder='Fullname'
                    className="bg-grey pl-8  p-3 focus:outline-none w-full rounded-lg"
                    />
                </div>
                <div className="flex flex-col justify-center gap-1">
                    <label className="text-sm font-medium text-white me-2" htmlFor="fullname">
                    Username:
                    </label>
                    <input
                    id="username"
                    name="username"
                    type="username"
                    value={username}
                    // autoComplete="email"
                    onChange={(e)=>{setUsername(e.target.value)}}
                    required
                    placeholder='Fullname'
                    className="bg-grey pl-8  p-3 focus:outline-none w-full rounded-lg"
                    />
                </div>
                <div className="flex flex-col justify-center gap-1">
                    <label className="text-sm font-medium text-white me-2" htmlFor="fullname">
                    email:
                    </label>
                    <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    // autoComplete="email"
                    onChange={(e)=>{setEmail(e.target.value)}}
                    required
                    placeholder='Email'
                    className="bg-grey pl-8  p-3 focus:outline-none w-full rounded-lg"
                    />
                </div>
                <div className="flex flex-col justify-center gap-1">
                    <label className="text-sm font-medium text-white me-2" htmlFor="fullname">
                    Bio:
                    </label>
                    <input
                    id="bio"
                    name="bio"
                    type="bio"
                    value={bio}
                    // autoComplete="email"
                    onChange={(e)=>{setBio(e.target.value)}}
                    required
                    placeholder='Bio'
                    className="bg-grey pl-8  p-3 focus:outline-none w-full rounded-lg"
                    />
                </div>
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
                            <span>update</span>
                        )}
                </button>
            </form>
            </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default EditForm