
// import React, { useEffect, useState } from 'react';
// import request from '../../common/utils/APIs/UserApis';
// import { toast } from 'sonner';

// function CommentContent({ handleClose,postId,comments,setComments }) {

//   const [comment,setComment] = useState();
//   const [reply, setReply] = useState({
//     reply:false,
//     accountName: '',
//     parentId: null
//   });
//   // const [allComments, setAllComments] = useState(comments);


//   // useEffect(()=>{

//   // },[allComments]);

//   const commentHandler = async()=>{
//     console.log("post id from postCard: ",postId)
//     if(reply.reply ==- false){
//       try {
//         const response = await request("POST", "/post/comment/addComments", {
//             postId: postId,
//             comment: comment,
//         });
//         console.log("reponse of aadding comment: ",response.data.commentRequest)
//         toast.success("Comment added successfully!");
//         setComment('');
//         // setAllComments(response.data.commentRequest,...allComments);
//       } catch (error) {
//         console.error('Error adding comment:', error);
//         setComment("");
//         toast.error(error.response ? error.response.data.message : error);
//       }
//     } else {
//       alert(reply.parentId)
//       try {
//         const response = await request("POST", "/post/comment/addReply", {
//             postId: postId,
//             comment: comment,
//             parentId: reply.parentId
//         });
//         console.log("reponse of aadding comment: ",response.data.commentRequest)
//         toast.success("Comment added successfully!");
//         setComment('');
//         // setAllComments(response.data.commentRequest,...allComments);
//       } catch (error) {
//         console.error('Error adding comment:', error);
//         setComment("");
//         toast.error(error.response ? error.response.data.message : error);
//       }
//     }
//   };

//   return (
//     <div className='flex flex-col p-2 h-full w-full bg-black shadow-lg rounded-t-2xl border-t-2 border-grey'>
//       {/* Close Icon and Title */}
//       <div className='flex justify-center w-full border-b-2 border-light_gray'>
//         <div className='flex flex-col items-center'>
//           <i
//             className="fa-solid fa-horizontal-rule text-grey text-4xl font-extrabold cursor-pointer"
//             onClick={handleClose}
//           ></i>
//           <h2 className='text-base font-medium text-grey pb-3 font-bold'>Comments</h2>
//         </div>
//       </div>

//       {/* Comment List */}
//       <div className='flex-grow overflow-hidden pt-3'>
//         <div className='flex flex-col px-16 py-8 gap-5 overflow-y-auto h-full' style={{ '-ms-overflow-style': 'none', 'scrollbar-width': 'none' }}>
//           {comments && comments.length > 0 && comments.map((data, index) => (
//             <div className='flex flex-col gap-3' key={index}>
//               <div className='flex gap-3'>
//                 <img src={data.user.imageUrl} alt="profile" className='rounded-full w-12 h-12' />
//                 <div className='flex flex-col'>
//                   <div className='flex gap-2 items-center'>
//                     <h3 className='text-white text-sm'>{data.user.accountName}</h3>
//                     <p className='text-light_gray text-sm'>{data.created}</p>
//                   </div>
//                   <div className='flex flex-col'>
//                     <h1 className='text-white text-lg'>{data.comment}</h1>
//                     <p className='text-light_gray text-sm cursor-pointer' onClick={() => setReply({ accountName: data.user.accountName, parentId: data.commentId , reply:true })}>reply</p>
//                   </div>
//                 </div>
//               </div>
//             {comments.replies && comments.replies.length > 0 && comments.replies.map((reply,index)=>(
//               <div className='flex gap-3 px-16'>
//               <img src="/images/profile.jpg" alt="profile" className='rounded-full w-9 h-9' />
//                 <div className='flex flex-col'>
//                   <div className='flex gap-2 items-center'>
//                     <h6 className='text-white text-xs'>account_name</h6>
//                     <p className='text-light_gray text-xs'>3w</p>
//                   </div>
//                   <div className='flex flex-col'>
//                     <h1 className='text-white text-lg'>nice one</h1>
//                     <p className='text-light_gray text-xs cursor-pointer' onClick={() => setReply({ accountName: data.user.accountName, parentId: data.commentId ,reply:true})}>reply</p>
//                   </div>
//                 </div>
//               </div>))}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Input for adding new comment */}
//       {/* {reply == null ? */}
//       <div className='w-full flex flex-col justify-center p-2 bg-black pb-[30%] md:pb-0'>
//         {reply.reply === true && (
//           <div className='h-10 bg-grey flex justify-between p-2 px-5 '>
//             <p className='text-white'>replying to {reply.accountName}</p>
//             <p className='text-white cursor-pointer' onClick={()=>setReply({
//               accountName:'',
//               reply:false,
//               parentId:null,
//             })}>X</p>
//         </div>
//         )}
//         <div className='flex'>
//         <input
//           id="tag"
//           name="tag"
//           placeholder="Add a comment..."
//           className={`focus:outline-none ${reply.accountName === '' ? 'rounded-l-lg': 'rounded-bl-lg'} h-10 w-[90%] p-2 text-white bg-light_gray `}
//           value={comment}
//           onChange={(e)=>setComment(e.target.value)}
//         />
//         <button className={`bg-green w-[10%]  ${reply.accountName === '' ? 'rounded-r-lg': 'rounded-br-lg'}`} onClick={commentHandler}></button>
//         </div>
//       </div>
//       {/* (<div className='w-full flex flex-col justify-center p-2 bg-black gap-1'>
//         <div className='h-10 bg-grey flex justify-between p-2'>
//             <p className='text-white'>replying to {reply}</p>
//             <p className='text-white cursor-pointer' onClick={()=>setReply(null)}>X</p>
//         </div>
//         <input
//           id="tag"
//           name="tag"
//           placeholder="Add a reply..."
//           className='focus:outline-none rounded-lg h-10  p-2 text-white bg-light_gray'
//         />
//       </div>)} */}
//     </div>
//   );
// }

// export default CommentContent;

import React, { useEffect, useState } from 'react';
import request from '../../common/utils/APIs/UserApis';
import { toast } from 'sonner';


const CommentContent = ({ handleClose, postId, comments, setComments }) => {
  // const [allComments,setAllComments] = useState(comments)
  const [comment, setComment] = useState('');
  const [reply, setReply] = useState({
    reply: false,
    accountName: '',
    parentId: null
  });

  const commentHandler = async () => {
    alert()
    if(!comment.trim()) {
      toast.error("Comment cannot be empty")
      return;
    }
    if (!reply.reply) {
      try {
        const response = await request("POST", "/post/comment/addComments", {
          postId: postId,
          comment: comment,
        });
        toast.success("Comment added successfully!");
        console.log("resposne for added comment: ",response.data)
        setComments(response.data.commentRequest);
        setComment('');
        

      } catch (error) {
        console.error('Error adding comment:', error);
        toast.error(error.response ? error.response.data.message : error.message);
      }
      console.log("comments are: ",comments)
    } else {
      try {
        const response = await request("POST", "/post/comment/addReply", {
          postId: postId,
          comment: comment,
          parentId: reply.parentId
        });
        toast.success("Reply added successfully!");
        setComment('');
        setReply({ reply: false, accountName: '', parentId: null });

      } catch (error) {
        console.error('Error adding reply:', error);
        toast.error(error.response ? error.response.data.message : error.message);
      }
    }
  };

  const renderComments = (comments) => {
    return comments?.map(comment => (
      <div key={comment.commentId} className='flex flex-col gap-3'>
        <div className='flex gap-3'>
          <img src={comment.user.imageUrl} alt="profile" className='rounded-full w-12 h-12' />
          <div className='flex flex-col'>
            <div className='flex gap-2 items-center'>
              <h3 className='text-white text-sm'>{comment.user.accountName}</h3>
              <p className='text-light_gray text-sm'>{comment.created}</p>
            </div>
            <div className='flex flex-col'>
              <h1 className='text-white text-lg'>{comment.comment}</h1>
              <p className='text-light_gray text-sm cursor-pointer' onClick={() => setReply({ accountName: comment.user.accountName, parentId: comment.commentId, reply: true })}>reply</p>
            </div>
          </div>
        </div>
        {comment.replies && comment.replies.length > 0 && (
          <div className='flex flex-col pl-12'>
            {renderComments(comment.replies)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className='flex flex-col p-2 h-full w-full bg-black shadow-lg rounded-t-2xl border-t-2 border-grey'>
      <div className='flex justify-center w-full border-b-2 border-light_gray'>
        <div className='flex flex-col items-center'>
          <i className="fa-solid fa-horizontal-rule text-grey text-4xl font-extrabold cursor-pointer" onClick={handleClose}></i>
          <h2 className='text-base font-medium text-grey pb-3 font-bold'>Comments</h2>
        </div>
      </div>

      <div className='flex-grow overflow-hidden pt-3'>
        <div className='flex flex-col px-16 py-8 gap-5 overflow-y-auto h-full' style={{ '-ms-overflow-style': 'none', 'scrollbar-width': 'none' }}>
        {comments && comments.length > 0 && renderComments(comments)}
        </div>
      </div>

      <div className='w-full flex flex-col justify-center p-2 bg-black pb-[30%] md:pb-0'>
        {reply.reply && (
          <div className='h-10 bg-grey flex justify-between p-2 px-5 '>
            <p className='text-white'>replying to {reply.accountName}</p>
            <p className='text-white cursor-pointer' onClick={() => setReply({ reply: false, accountName: '', parentId: null })}>X</p>
          </div>
        )}
        <div className='flex'>
          <input
            id="tag"
            name="tag"
            placeholder="Add a comment..."
            className={`focus:outline-none ${reply.accountName === '' ? 'rounded-l-lg' : 'rounded-bl-lg'} h-10 w-[90%] p-2 text-white bg-light_gray `}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button className={`bg-green w-[10%] ${reply.accountName === '' ? 'rounded-r-lg' : 'rounded-br-lg'}`} onClick={commentHandler}></button>
        </div>
      </div>
    </div>
  );
}

export default CommentContent;

