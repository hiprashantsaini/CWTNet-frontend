import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";

const LoginForm = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const navigate=useNavigate();
	const queryClient = useQueryClient();

	const { mutate: loginMutation, isLoading } = useMutation({
		mutationFn: (userData) => axiosInstance.post("/auth/login", userData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: (err) => {
			console.log("response :",err)
			toast.error(err.response.data.message || "Something went wrong");
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		loginMutation({ username, password });
	};

	const handleReset=()=>{
        navigate('/resetPassword');
	}

	return (
		<form onSubmit={handleSubmit} className='space-y-4 w-full max-w-md'>
			<input
				type='text'
				placeholder='Username'
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				className='input input-bordered w-full'
				required
			/>
			<input
				type='password'
				placeholder='Password'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				className='input input-bordered w-full'
				required
			/>
            <h2 onClick={handleReset} className="text-[#6E6BF5] text-xl font-semibold cursor-pointer hover:text-[#5b58e9]">Forgot Password</h2>
			<button type='submit' className='btn w-2/3 flex rounded-2xl bg-[#6E6BF5] hover:bg-[#6E6BF5] hover:scale-105 mx-auto text-[#ffffff] text-lg font-semibold'>
				{isLoading ? <Loader className='size-5 animate-spin' /> : "Sign in"}
			</button>
		</form>
	);
};
export default LoginForm;
