import { Link } from 'react-router-dom';
import logo from "../../public/Logo.png";
import seeker from "../../public/Screenshot 2025-02-03 114633.png";
import provider from "../../public/Screenshot 2025-02-03 114700.png";

const LandingPage = () => {
  return (
    <div className="w-full p-4 bg-white">
      <div className="text-center w-full">
        <img src={logo} className='h-6 sm:h-8' />
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full min-h-[85vh] items-center max-w-4xl justify-center mx-auto">
        <Link to="/signup/Seeker"
          className="group hover:shadow-xl transition-all duration-300 cursor-pointer w-52 md:w-96 p-7 border-b-2 border-b-violet-700"
        >
          <div className="flex flex-col items-center text-center">
            <img src={seeker} />
          </div>
        </Link>

        <Link to="/signup/Provider"
          className="group hover:shadow-xl transition-all duration-300 cursor-pointer w-52 md:w-96 p-8 pb-11 border-b-2 border-b-violet-700"
        >
          <div className="flex flex-col items-center text-center">
            <img src={provider} />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;