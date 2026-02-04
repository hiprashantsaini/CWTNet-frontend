import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import homeIcon from "../../../public/homeIcon.png";
import msgIcon from "../../../public/messageIconCroped.png";
import peopleIcon from "../../../public/Rectangle2.png";

import { axiosInstance } from "../../lib/axios";

const Navbar = () => {
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const queryClient = useQueryClient();

	const { data: notifications } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => axiosInstance.get("/notifications"),
		enabled: !!authUser,
	});

	const { data: connectionRequests } = useQuery({
		queryKey: ["connectionRequests"],
		queryFn: async () => axiosInstance.get("/connections/requests"),
		enabled: !!authUser,
	});

	const { mutate: logout } = useMutation({
		mutationFn: () => axiosInstance.post("/auth/logout"),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});

	const unreadNotificationCount = notifications?.data.filter((notif) => !notif.read).length;
	const unreadConnectionRequestsCount = connectionRequests?.data?.length;

	return (
		<nav className='bg-secondary shadow-md sticky top-0 z-10'>
			<div className='max-w-7xl mx-auto px-4'>
				<div className='flex justify-between items-center py-3'>
					<div className='flex items-center space-x-4'>
						<Link to='/'>
							<img className='h-10 sm:h-14 rounded' src='/Logo.png' alt='CWTNet' />
						</Link>
					</div>
					<div className='flex items-center gap-2 md:gap-6'>
						{authUser ? (
							<>
								<Link to={"/"} className='text-neutral flex flex-col items-center'>
									<img src={homeIcon} className="size-8" />
									<span className='text-xs hidden md:block'>Home</span>
								</Link>
								<Link to='/network' className='text-neutral flex flex-col items-center relative'>
									<img src={peopleIcon} className="size-8" />
									<span className='text-xs hidden md:block'>People</span>
									{unreadConnectionRequestsCount > 0 && (
										<span
											className='absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs 
										rounded-full size-3 md:size-4 flex items-center justify-center'
										>
											{unreadConnectionRequestsCount}
										</span>
									)}
								</Link>
								{
									authUser.type === 'Seeker' ? <Link to={"/internships"} className='text-neutral flex flex-col items-center'>
										<img src="/internshipIcon.png" className="size-8" />
										<span className='text-xs hidden md:block'>Internships</span>
									</Link> :
										<Link to={"/analytics"} className='text-neutral flex flex-col items-center'>
											<img src="/analyticsIconCroped.png" className="size-8" />
											<span className='text-xs hidden md:block'>Analytics</span>
										</Link>
								}

								<Link to={"/messages"} className='text-neutral flex flex-col items-center'>
									<img src={msgIcon} className="size-8" />
									<span className='text-xs hidden md:block'>Messages</span>
								</Link>
								<Link to='/notifications' className='text-neutral flex flex-col items-center relative'>
									<Bell size={32} />
									<span className='text-xs hidden md:block'>Notifications</span>
									{unreadNotificationCount > 0 && (
										<span
											className='absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs 
										rounded-full size-3 md:size-4 flex items-center justify-center'
										>
											{unreadNotificationCount}
										</span>
									)}
								</Link>
								<div className="h-11 border border-r-black"></div>
								{/* <div className="hidden sm:block border border-r-slate-700 h-11"></div> */}
								<Link
									to={`/profile/${authUser.username}`}
									className='text-neutral flex flex-col items-center'
								>
									{
										authUser.profilePicture ? <img src={authUser.profilePicture} className="size-9 rounded-full" /> : <img src="/me.png" className="size-8" />
									}
									<span className='text-xs hidden md:block'>Me</span>
								</Link>
								<button
									className='flex flex-col items-center space-x-1 text-sm text-gray-600 hover:text-gray-800'
									onClick={() => logout()}
								>
									<LogOut size={28} />
									<span className='hidden md:inline'>Logout</span>
								</button>
							</>
						) : (
							<>
								<Link to='/login' className='btn btn-ghost'>
									Sign In
								</Link>
								<Link to='/type' className='btn btn-primary'>
									Join now
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};
export default Navbar;
