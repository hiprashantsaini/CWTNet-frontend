import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const NewLandingPage = () => {
  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col items-center">
      {/* Navbar */}
      <div className="w-full flex justify-between items-center p-3 sm:p-6 border-b">
        <h1 className="font-bold text-blue-700 w-32 sm:w-52">
          <img src="/Logo.png" className="w-full h-auto"/>
        </h1>
        <div className="flex items-center space-x-3 sm:space-x-6">
          <div className="flex space-x-2 sm:space-x-4 text-black font-semibold">
            <div className="text-center">
              <img 
                src="/Rectangle2.png"
                alt="People" 
                className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" 
              />
              <p className="hidden sm:block">People</p>
            </div>
            <div className="text-center">
              <img 
                src="/Rectangle3.png" 
                alt="Learning" 
                className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" 
              />
              <p className="hidden sm:block">Learning</p>
            </div>
            <div className="text-center">
              <img 
                src="/Rectangle4.png" 
                alt="Jobs" 
                className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" 
              />
              <p className="hidden sm:block">Internships</p>
            </div>
            <div className="text-center">
              <img 
                src="/Rectangle5.png" 
                alt="Training" 
                className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" 
              />
              <p className="hidden sm:block">Training</p>
            </div>
          </div>
          <div className="hidden sm:block border border-r-slate-700 h-11"></div>
          <Link 
            to='/type' 
            className="hidden sm:block text-lg font-bold"
          >
            Join Now
          </Link>
          <Link 
            to='/login' 
            className="border-2 border-blue-500 text-blue-700 px-3 sm:px-6 py-1 sm:py-2 rounded-lg font-bold hover:bg-blue-100 text-sm sm:text-base whitespace-nowrap"
          >
            Sign In
          </Link>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto mt-12 my-auto">
      <Swiper
        // modules={[Autoplay, Pagination, Navigation]} //To apply on click slide change
        modules={[Autoplay, Pagination,Navigation]} //To apply on click slide change
        spaceBetween={50}
        slidesPerView={1}
        // autoplay={{ delay: 3000, disableOnInteraction: false }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
          stopOnLastSlide: false,
          waitForTransition: true,
          reverseDirection: false,
          resumeOnMouseLeave: true    // This will resume autoplay when mouse leaves
        }}
        pagination={{ clickable: true }}
        navigation //To apply on click slide change
        loop={true}
        className="rounded-lg"
      >
        {/* Slide 1 */}
      <SwiperSlide>
          <div className="flex flex-col lg:flex-row items-center justify-center px-8">
            <div className="text-center lg:text-left max-w-md">
              <h2 className="text-4xl font-bold text-gray-700 leading-snug text-center">
                World values what you can do, not just what you know!
              </h2>
              <p className="mt-4 text-lg text-gray-600 text-center">
                New to <span className="font-bold">CWTNet</span>?{" "}
                <Link to="/type" className="text-blue-700 font-bold">Join Now</Link>
              </p>
            </div>
            <div className="mt-8 lg:mt-0 lg:ml-12">
              <img src="/tempImageQVC8FW.png" alt="Skills vs Degrees" className="w-full max-w-2xl rounded-lg" />
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 2 */}
        <SwiperSlide>
          <div className="flex flex-col lg:flex-row items-center justify-center px-8">
            <div className="text-center lg:text-left max-w-md">
              <h2 className="text-4xl font-bold text-gray-700 leading-snug text-center">
                Master any skill, anytime, anywhere – Distraction-free!
              </h2>
              <p className="mt-4 text-lg text-gray-600 text-center">
                New to <span className="font-bold">CWTNet</span>?{" "}
                <Link to="/type" className="text-blue-700 font-bold">Join Now</Link>
              </p>
            </div>
            <div className="mt-8 lg:mt-0 lg:ml-12">
              <img src="/tempImagen3dNmU.png" alt="Learning" className="w-full max-w-2xl rounded-lg" />
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 3 */}
        <SwiperSlide>
          <div className="flex flex-col lg:flex-row items-center justify-center px-8">
            <div className="text-center lg:text-left max-w-md">
              <h2 className="text-4xl font-bold text-gray-700 leading-snug text-center">
                Connect, learn, and grow together. Whether 1-on-1, in groups, or through peer insights
              </h2>
              <p className="mt-4 text-lg text-gray-600 text-center">
                New to <span className="font-bold">CWTNet</span>?{" "}
                <Link to="/type" className="text-blue-700 font-bold">Join Now</Link>
              </p>
            </div>
            <div className="mt-8 lg:mt-0 lg:ml-12">
              <img src="/tempImagewOETr1.png" alt="Community Learning" className="w-full max-w-2xl rounded-lg" />
            </div>
          </div>
        </SwiperSlide>

      {/* Slide 4 */}
      <SwiperSlide>
          <div className="flex flex-col lg:flex-row items-center justify-center px-8">
            <div className="text-center lg:text-left max-w-md">
              <h2 className="text-4xl font-bold text-gray-700 leading-snug text-center">
              Your Journey to Success Starts Here.
              </h2>
              <p className="p-1 w-[80%] mx-auto text-lg text-center border-2 border-black rounded-xl flex justify-center gap-2 items-center cursor-pointer"><img className="w-7 h-7" src="/googleIcon.png"/><p>Continue With Google</p></p>
              <p className="p-1 w-[80%] mx-auto text-lg text-center border-2 border-black rounded-xl my-2 cursor-pointer">SignIn With email</p>
              <p className="p text-center">By clicking Continue to join or sign in, you agree to EduVerse’s <span className="text-[#110CF6] font-bold cursor-pointer">User Agreement , Privacy Policy</span>, and <span className="text-[#110CF6] font-bold cursor-pointer">Cookie Policy.</span></p>
              <p className="mt-1 text-lg text-gray-600 text-center">
                New to <span className="font-bold">CWTNet</span>?{" "}
                <Link to="/type" className="text-blue-700 font-bold">Join Now</Link>
              </p>
            </div>
            <div className="mt-8 lg:mt-0 lg:ml-12">
              <img src="/loginSideimg.png" alt="Skills vs Degrees" className="w-full max-w-2xl rounded-lg" />
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
    </div>
  );
};

export default NewLandingPage;
