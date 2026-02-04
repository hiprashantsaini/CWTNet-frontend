import { Link } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";

const LoginPage = () => {
	return (
		<div className='min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
			<div className='sm:mx-auto sm:w-full sm:max-w-md'>
				<h2 className=' text-center text-3xl font-extrabold text-gray-900'>Sign in to your account</h2>
			</div>

			<div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md shadow-md'>
				<div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
					<LoginForm />
					{/* <div className='mt-6'>
						<div className='relative'>
							<div className='absolute inset-0 flex items-center'>
								<div className='w-full border-t border-gray-300'></div>
							</div>
							<div className='relative flex justify-center text-sm'>
								<span className='px-2 bg-white text-gray-500'>New to LinkedIn?</span>
							</div>
						</div>
						<div className='mt-6'>
							<Link
								to='/landingpage'
								className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-gray-50'
							>
								Join now
							</Link>
						</div>
					</div> */}
					<div className="flex flex-col lg:flex-row items-center justify-center mt-4">
						<div className="text-center lg:text-left max-w-md">
						  <p className="flex items-center justify-center"><p className="w-2/5 border-t-2 border-t-slate-400"></p><p className="w-1/5 text-center">OR</p><p className="w-2/5 border-t-2 border-t-slate-400"></p></p>
						  <p className="p text-center">By clicking Continue to join or sign in, you agree to EduVerse’s <span className="text-[#110CF6] font-bold cursor-pointer">User Agreement , Privacy Policy</span>, and <span className="text-[#110CF6] font-bold cursor-pointer">Cookie Policy.</span></p>
						  {/* <p className="p-1 w-full mx-auto text-lg text-center border-2 border-black rounded-xl flex justify-center gap-2 items-center cursor-pointer mt-2"><img className="w-7 h-7" src="/googleIcon.png"/><p>Continue With Google</p></p> */}
						  {/* <GoogleSignIn/> */}
						  <p className="mt-1 text-lg text-gray-600 text-center">
							New to <span className="font-bold">CWTNet</span>?{" "}
							<Link to="/type" className="text-blue-700 font-bold">Join Now</Link>
						  </p>
						</div>
					  </div>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;
