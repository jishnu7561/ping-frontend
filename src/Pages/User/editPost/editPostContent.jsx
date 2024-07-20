import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import request from '../../../common/utils/APIs/UserApis';
import { useNavigate, useParams } from 'react-router-dom';
import Slider from '../../home/slider';

function EditPostContent() {

  const [caption, setCaption] = useState('');
  const [tag, setTag] = useState('');
  const [loading,setLoading] = useState(false);
  const [post, setPost] = useState();
  const navigate = useNavigate();
  const { postId } = useParams();
  const [imageUrl,setImageUrl] = useState([]);

  useEffect(()=>{
    request(
        "GET",
        `/post/getPostDetails/${postId}`,
        {}
    ).then((response)=>{
        setPost(response.data);
        setCaption(response.data.caption);
        setTag(response.data.tag);
        setImageUrl(response.data.image);
        console.log("response of post :",response);
    }).catch((error)=>{
        toast.error(error);
    })
},[postId,loading])

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!caption.trim()) {
      toast.error('Caption is required.');
      return;
    }

    if (!tag.trim()) {
      toast.error('Tag is required.');
      return;
    }

    setLoading(true);
    request(
      'POST',
      `/post/editPost/${postId}`,
      {
        caption:caption,
        tag:tag
      }
    )
      .then((response) => {
        console.log(response.data);
        toast.success(response.data.message);
        setLoading(false)
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
          <div className='flex gap-2 items-center'>
            <i class="fa-thin fa-user-pen text-white text-2xl"></i>
            <h2 className='text-white font-semibold'>Edit Post</h2>
          </div>
          <div className='flex flex-col gap-8 lg:px-20 pb-10 lg:p-5'>
            <div className='flex flex-col gap-2'>
              <label htmlFor="description" className='text-white text-sm'>Caption</label>
              <textarea id="description" name="description" rows="4"
                placeholder=""
                className='bg-grey focus:outline-none rounded-lg w-full p-2'
                value={caption}
                onChange={(e)=>{setCaption(e.target.value)}}
                ></textarea>
            </div>
            <div className='flex flex-col gap-2'>
              <label htmlFor="photo" className='text-white text-sm'>Add photos</label>
              <div className='flex bg-grey w-full p-10 rounded-lg justify-center items-center'>
                <div className='flex flex-col gap-2 justify-center items-center w-full'>
                {imageUrl?.length > 1 ? (
                <div className="my-2 relative">
                 <Slider imageUrl={imageUrl}/>     
                </div>
                ):
                (<img 
                src={imageUrl[0]}
                alt="post-card-img" 
                className='rounded-2xl'
                />)}
                  
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <label htmlFor="tag" className='text-white text-sm'>Tag</label>
              <input id="tag" name="tag"
                placeholder=""
                className='bg-grey focus:outline-none rounded-lg h-10 p-2' 
                value={tag}
                onChange={(e)=>{setTag(e.target.value)}}
                />
            </div>

            <button type="button" className='w-full h-10 text-white rounded-lg bg-green'
             onClick={submitHandler}
             disabled={loading}>
             {loading ? (
              <img
              src="/images/loader.svg" // Replace with your loading image path
              alt="Loading..."
              className="w-5 h-5 mx-auto" // Adjust image size and position as needed
              />
            ) : (
            <span>Edit</span>
            )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditPostContent