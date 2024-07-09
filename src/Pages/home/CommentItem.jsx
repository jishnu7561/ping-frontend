// import React from 'react';

// const CommentItem = ({ comment, setReply }) => {
//   return (
//     <div className='flex flex-col gap-3'>
//       <div className='flex gap-3'>
//         <img src={comment.user.imageUrl} alt="profile" className='rounded-full w-12 h-12' />
//         <div className='flex flex-col'>
//           <div className='flex gap-2 items-center'>
//             <h3 className='text-white text-sm'>{comment.user.accountName}</h3>
//             <p className='text-light_gray text-sm'>{comment.created}</p>
//           </div>
//           <div className='flex flex-col'>
//             <h1 className='text-white text-lg'>{comment.comment}</h1>
//             <p className='text-light_gray text-sm cursor-pointer' onClick={() => setReply({ accountName: comment.user.accountName, parentId: comment.commentId, reply: true })}>reply</p>
//           </div>
//         </div>
//       </div>
      
//       {/* Display replies */}
//       {comment.replies && comment.replies.length > 0 && comment.replies.map((reply, index) => (
//         <div className='flex gap-3 pl-16' key={index}>
//           <img src={reply.user.imageUrl} alt="profile" className='rounded-full w-9 h-9' />
//           <div className='flex flex-col'>
//             <div className='flex gap-2 items-center'>
//               <h6 className='text-white text-xs'>{reply.user.accountName}</h6>
//               <p className='text-light_gray text-xs'>{reply.created}</p>
//             </div>
//             <div className='flex flex-col'>
//               <h1 className='text-white text-lg'>{reply.comment}</h1>
//               <p className='text-light_gray text-xs cursor-pointer' onClick={() => setReply({ accountName: reply.user.accountName, parentId: reply.commentId, reply: true })}>reply</p>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default CommentItem;
