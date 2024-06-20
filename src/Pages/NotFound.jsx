import React from 'react'
import { useNavigate } from 'react-router-dom';

function NotFound() {
    const navigate = useNavigate()
  return (
    <>
      {/* <NavBar fixed={"top"} bg="white" /> */}

      <div className="w-10/12 mx-auto my-10">
        <div className="lg:px-24  lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16">
          <div className="xl:pt-24 w-full xl:w-1/2 relative pb-12 lg:pb-0">
            <div className="relative">
              <div className="absolute">
                <div className="">
                  <h1 className="my-2 text-gray-800 font-bold text-2xl">
                    Looks like you've found the doorway to the great nothing
                  </h1>
                  <p className="my-2 text-gray-800">
                    Sorry about that! Please visit our hompage to get where you
                    need to go.
                  </p>
                  <button onClick={()=>navigate('/')} className="sm:w-full lg:w-auto my-2 border rounded md py-4 px-8 text-center bg-green text-white hover:bg-flexy-green focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50">
                    Take me there!
                  </button>
                </div>
              </div>
              <div>
                {/* <img src="https://raw.githubusercontent.com/arshadakl/assets/main/404Txt.png" /> */}
              </div>
            </div>
          </div>
          <div>
            {/* <img src="https://raw.githubusercontent.com/arshadakl/assets/main/404Icon.png" /> */}
          </div>
        </div>
      </div>
      {/* <Footer/> */}
    </>
  );
}

export default NotFound;