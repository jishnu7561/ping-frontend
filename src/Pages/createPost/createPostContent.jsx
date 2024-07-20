import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import request, { save } from '../../common/utils/APIs/UserApis';
import { toast } from 'sonner';

function CreatePostContent() {

  const fileInputRef = useRef(null);
  const { loggedUser } = useSelector((state) => state.auth);
  const [images, setImages] = useState([]); // Array to hold selected images
  const [imageSrcs, setImageSrcs] = useState([]); // Array to hold image previews
  const [caption, setCaption] = useState('');
  const [tag, setTag] = useState('');
  const [loading,setLoading] = useState(false);

  const handleImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const newImages = Array.from(event.target.files); // Convert FileList to array
    setImages((prevImages) => [...prevImages, ...newImages]); // Update images state efficiently

    const validImageTypes = ['image/png', 'image/jpeg'];
    for (const image of newImages) {
      if (!validImageTypes.includes(image.type)) {
        toast.error(`${image.name} is not a valid image (png/jpeg).`);
        return;
      }
    }


    const reader = new FileReader();
    reader.onload = () => {
      setImageSrcs((prevSrcs) => [...prevSrcs, reader.result]); // Update image previews
    };

    // Loop through new images and read them one by one
    for (const image of newImages) {
      reader.readAsDataURL(image);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!caption.trim()) {
      toast.error('Caption is required.');
      return;
    }

    if (images.length === 0) {
      toast.error('At least one image must be selected.');
      return;
    }

    if (!tag.trim()) {
      toast.error('Tag is required.');
      return;
    }

    setLoading(true)

    const formData = new FormData(); // Use FormData for multiple file uploads
    formData.append('caption', caption);
    formData.append('tag', tag);

    for (const image of images) { // Append each image to the FormData
      formData.append('file', image);
    }

    request(
      'POST',
      `/post/create-post/${loggedUser.id}`,
      formData
    )
      .then((response) => {
        console.log(response.data);
        toast.success(response.data.message);
        setLoading(false)
        setImages([]); // Clear images state after successful upload
        setImageSrcs([]);
        setCaption('');
        setTag('');
        
      })
      .catch((error) => {
        console.log(error);
        toast.error(error);
      });
  };


  return (
    <div className='w-full h-full bg-black lg:bg-grey overflow-y-auto' style={{ '-ms-overflow-style': 'none', 'scrollbar-width': 'none' }}>
      <div className='flex flex-wrap w-full justify-center lg:p-10  pb-20'>
        <div className='flex flex-col w-full gap-10 bg-black lg:p-10 p-5 pt-10 gap-8 lg:rounded-xl '>
          <div className='flex gap-2'>
            <img src="/images/add-post.svg" alt="post" className='w-6' />
            <h2 className='text-white font-semibold'>Create Post</h2>
          </div>
          <form className='flex flex-col gap-8 lg:px-20 pb-10 lg:p-5'>
            <div className='flex flex-col gap-2'>
              <label htmlFor="description" className='text-white text-sm'>Caption</label>
              <textarea id="description" name="description" rows="4"
                placeholder=""
                className='bg-grey focus:outline-none rounded-lg w-full p-2'
                // value={formData.description}
                // onChange={handleInputChange}
                value={caption}
                onChange={(e)=>{setCaption(e.target.value)}}
                ></textarea>
            </div>
            <div className='flex flex-col gap-2'>
              <label htmlFor="photo" className='text-white text-sm'>Add photos</label>
              <div className='flex bg-grey w-full p-10 rounded-lg justify-center items-center'>
                  <div className='flex flex-col gap-2 justify-center items-center w-full'>

                  {imageSrcs.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`image-${index}`}
                    style={{ maxWidth: '200px', maxHeight: '200px', margin: '10px' }}
                  />
                  ))}

                  {
                    imageSrcs.length=== 0 && 
                    (<img src="/images/file-upload.svg" alt="upload-image" className='text-white' />)
                  }
                    <button type="button" className='w-full h-10 text-white rounded-lg'
                      style={{ backgroundColor: "#5c5c7b" }}
                      onClick={handleImage}
                    >
                      Select photo
                    </button>
                    <input type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      multiple
                      onChange={handleFileChange}
                    />
                  </div>
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <label htmlFor="tag" className='text-white text-sm'>Tag</label>
              <input id="tag" name="tag"
                placeholder=""
                className='bg-grey focus:outline-none rounded-lg h-10 p-2' 
                // value={formData.tag}
                // onChange={handleInputChange}
                value={tag}
                onChange={(e)=>{setTag(e.target.value)}}
                />
            </div>


            {/* <button
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
          </button> */}

            <button type="button" className='w-full h-10 text-white rounded-lg bg-green'
             onClick={submitHandler}
             disabled={loading}>
             {loading ? (
              <img
              src="images/loader.svg" // Replace with your loading image path
              alt="Loading..."
              className="w-5 h-5 mx-auto" // Adjust image size and position as needed
              />
            ) : (
            <span>Upload</span>
            )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreatePostContent;
