import React from 'react'
import { Link } from 'react-router-dom'

function ExploreContent() {
  return (
    <div className=' bg-grey w-full h-full'>
        <div className='home-container px-3'>
            <h2 className='font-bold md:font-medium text-white w-full py-3 text-xl'>Explore here</h2>
            <div className='flex gap-2 px-4 w-full rounded-lg bg-black items-center'>
                <i class="fa-light fa-magnifying-glass text-white"></i>
                <input 
                    type='text'
                    placeholder='Search'
                    className='bg-black h-10 focus:outline-none text-white'
                    ></input>
            </div>
            <div className='flex justify-between w-full mt-10 mb-7 items-center'>
                <h3 className='font-bold text-lg text-white'>Popular Today</h3>
                <div className='flex items-center gap-2 bg-black rounded-xl px-4 py-2 cursor-pointer'>
                    <p className='text-white font-light'>All</p>
                    <i class="fa-light fa-bars-filter text-white"></i>
                </div>
            </div>

            <div className='flex flex-wrap gap-9 w-full max-w-5xl'>
                <ul className='flex flex-col gap-9'>
                    <li className='relative min-w-80 h-80 rounded-2xl overflow-hidden '>
                        <Link to={"/post"}>
                            <img src="/images/profile.jpg" className='h-full w-full object-cover' alt='post'></img>
                        </Link>
                        <div className='footer absolute inset-x-0 bottom-0 flex items-center justify-between py-2 px-4 bg-black bg-opacity-60'>
                            <div className='flex gap-2'>
                                <img src="/images/profile.jpg" alt="creater" className='h-8 w-8 rounded-full' />
                                <p className='line-clamp-1 text-white'>jishnu</p>
                            </div> 
                            <div className='flex gap-1 ml-2 items-center'>
                                <i class="fa-light fa-heart text-green text-xl"></i>
                                <p className='text-white'>0</p>
                            </div>
                        </div>
                    </li>

{/* ================= repeat ========================== */}

                    <li className='relative min-w-80 h-80 rounded-2xl overflow-hidden'>
                        <Link to={"/post"}>
                            <img src="/images/profile.jpg" className='h-full w-full object-cover' alt='post'></img>
                        </Link>
                        <div className='footer absolute inset-x-0 bottom-0 flex items-center justify-between py-2 px-4 bg-black bg-opacity-60'>
                            <div className='flex gap-2'>
                                <img src="/images/profile.jpg" alt="creater" className='h-8 w-8 rounded-full' />
                                <p className='line-clamp-1 text-white'>jishnu</p>
                            </div> 
                            <div className='flex gap-1 ml-2 items-center'>
                                <i class="fa-light fa-heart text-green text-xl"></i>
                                <p className='text-white'>0</p>
                            </div>
                        </div>
                    </li>
                
                </ul>
            </div>

        </div>
    </div>
  )
}

export default ExploreContent