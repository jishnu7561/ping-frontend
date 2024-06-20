import React, { useState } from 'react'

function Slider({imageUrl}) {

    const [curr,setCurr] = useState(0);
    const prev = () =>
        setCurr((curr)=> (curr== 0 ? imageUrl.length-1 : curr-1))
    const next = () =>
        setCurr((curr)=> (curr== imageUrl.length-1 ? 0 : curr+1))

  return (
    <>
        <img src={imageUrl[curr]} alt={`post image `} className="rounded-xl transition-all w-full h-80 " />
        <div className='absolute inset-0 flex flex items-center justify-between p-4'>
            <button className='p-1 ' onClick={prev}>
                <i class="fa-solid fa-arrow-left text-green"></i>
            </button>
            <button className='p-1 ' onClick={next}>
                <i class="fa-solid fa-arrow-right text-green"></i>
            </button>
        </div>
        <div className='absolute bottom-4 right-0 left-0'>
            <div className='flex items-center justify-center gap-2'>
            {imageUrl.map((_,i)=>(
                <div className={`transition-all w-2 h-2 bg-green rounded-full
                ${curr ===i? "p-1.5" : "bg-opacity-50"}`} onClick={()=>setCurr(i)}></div>
                ))}
            </div>
        </div>
    </>
  )
}

export default Slider