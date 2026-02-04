import { Link, useParams } from "react-router-dom";
import SignUpForm from "../../components/auth/SignUpForm";

const SignUpPage = () => {
	const {type} =useParams();
	return (
		<div className='min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
			<div className='sm:mx-auto sm:w-full sm:max-w-md'>
			<h2 className="text-4xl font-bold text-gray-700 leading-snug text-center">
						  Your Journey to Success Starts Here.
		   </h2>
			</div>
			<div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md shadow-md'>
				<div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
					<SignUpForm />

					{/* <div className='mt-6'>
						<div className='relative'>
							<div className='absolute inset-0 flex items-center'>
								<div className='w-full border-t border-gray-300'></div>
							</div>
							<div className='relative flex justify-center text-sm'>
								<span className='px-2 bg-white text-gray-500'>Already on LinkedIn?</span>
							</div>
						</div>
						<div className='mt-6'>
							<Link
								to='/login'
								className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-gray-50'
							>
								Sign in
							</Link>
						</div>
					</div> */}
					<div className="flex flex-col lg:flex-row items-center justify-center mt-4">
						<div className="text-center w-full">
						  {/* <p className="p-1 mx-auto text-lg text-center border-2 border-black rounded-xl flex justify-center gap-2 items-center cursor-pointer"><img className="w-7 h-7" src="/googleIcon.png"/><p>Continue With Google</p></p> */}
						  {/* <GoogleSignIn/> */}
						  <p className="flex items-center"><p className="w-2/5 border-t-2 border-t-slate-400"></p><p className="w-1/5 text-center">OR</p><p className="w-2/5 border-t-2 border-t-slate-400"></p></p>
						  <p className="mt-1 text-lg text-gray-600 text-center">
							Already on <span className="font-bold">CWTNet</span>?{" "}
							<Link to="/login" className="text-blue-700 font-bold">Sign in</Link>
						  </p>
						</div>
					  </div>
				</div>
			</div>
		</div>
	);
};
export default SignUpPage;
