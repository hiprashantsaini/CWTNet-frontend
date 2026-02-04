import { useQuery } from "@tanstack/react-query";
import { BookImage, MailOpen, Newspaper, Users, X } from "lucide-react";
import { useState } from "react";
import MessagesList from "../components/MessagesList";
import Post from "../components/Post";
import PostCreation from "../components/PostCreation";
import RecommendedUser from "../components/RecommendedUser";
import Sidebar from "../components/Sidebar";
import { axiosInstance } from "../lib/axios";

const HomePage = () => {
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const [addPost, setAddPost] = useState(false);
	

	const { data: recommendedUsers } = useQuery({
		queryKey: ["recommendedUsers"],
		queryFn: async () => {
			const res = await axiosInstance.get("/users/suggestions");
			return res.data;
		},
	});

	const { data: posts } = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			const res = await axiosInstance.get("/posts");
			return res.data;
		},
	});

	return (
		<div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
			<MessagesList/>
			<div className='hidden lg:block lg:col-span-1'>
				<Sidebar user={authUser} />
			</div>

			<div className='col-span-1 lg:col-span-2 order-first lg:order-none'>
				<div className="bg-white p-4 mb-4 rounded-lg drop-shadow-[0_4px_4px_rgba(0,0,0,0.6)]">
					<div className="flex justify-center gap-4">
						<div className="w-12 h-12 rounded-full"><img className="w-full h-full rounded-full" src={authUser.profilePicture}/></div>
						<button onClick={()=>setAddPost(true)} className="bg-gray-100 flex-1 rounded-3xl text-left pl-6">Add a post</button>
					</div>
					<div className="flex justify-between items-center p-2">
						<div className="flex items-center gap-2"><BookImage className="text-blue-600 size-5"/><p>Media</p></div>
						<div className="flex items-center gap-2"><MailOpen className="text-orange-500 size-5"/><p>Contribute expertise</p></div>
						<div className="flex items-center gap-2"><Newspaper className="text-red-500 size-5"/>Write article</div>
					</div>
				</div>
				{
                addPost && (
                    <div className="fixed inset-0 z-40 bg-gray-300 bg-opacity-35 flex justify-center items-center">
                        <div className="w-[98vw] sm:w-[60vw] md:w-[600px] relative">
                            <X onClick={()=>setAddPost(false)} className="absolute right-2 cursor-pointer hover:text-red-600"/>
                            <PostCreation user={authUser} setAddPost={setAddPost}/>
                        </div>
                    </div>
                )
            }
				{/* <PostCreation user={authUser} /> */}

				{posts?.map((post) => (
					<Post key={post._id} post={post} />
				))}

				{posts?.length === 0 && (
					<div className='bg-white rounded-lg shadow p-8 text-center'>
						<div className='mb-6'>
							<Users size={64} className='mx-auto text-blue-500' />
						</div>
						<h2 className='text-2xl font-bold mb-4 text-gray-800'>No Posts Yet</h2>
						<p className='text-gray-600 mb-6'>Connect with others to start seeing posts in your feed!</p>
					</div>
				)}
			</div>

			{recommendedUsers?.length > 0 && (
				<div className='col-span-1 lg:col-span-1 hidden lg:block'>
					<div className='bg-secondary rounded-lg shadow p-4'>
						<h2 className='font-semibold mb-4'>People you may know</h2>
						{recommendedUsers?.map((user) => (
							<RecommendedUser key={user._id} user={user} />
						))}
					</div>
				</div>
			)}
		</div>
	);
};
export default HomePage;
