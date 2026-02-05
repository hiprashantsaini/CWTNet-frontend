import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import AIGuru from "./aiGuru/AIGuru";
import Home from "./aiGuru/home/Home";
import Settings from "./aiGuru/sidebar/Settings";
import Assessment from "./aiSkillTest/pages/Assessment";
import Certificate from './aiSkillTest/pages/Certificate';
import Progress from './aiSkillTest/pages/Progress';
import Recommendations from './aiSkillTest/pages/Recommendations';
import Results from './aiSkillTest/pages/Results';
import TestInterface from "./aiSkillTest/pages/TestInterface";
import MessageRoom from "./components/MessageRoom";
import Internship from "./components/profileComponents/Internship";
import { TestProvider } from "./context/TestContext";
import { axiosInstance } from "./lib/axios";
import AISkillTestPage from "./pages/AISkillTestPage";
import LoginPage from "./pages/auth/LoginPage";
import ResetPassword from "./pages/auth/ResetPassword";
import SignUpPage from "./pages/auth/SignUpPage";
import EventDetail from "./pages/EventDetail";
import Events from "./pages/Events";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import NetworkPage from "./pages/NetworkPage";
import NewLandingPage from "./pages/NewLandingPage ";
import NotificationsPage from "./pages/NotificationsPage";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";

const clientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;

function App() {
	const { data: authUser, isLoading } = useQuery({
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				const res = await axiosInstance.get("/auth/me");
				return res.data;
			} catch (err) {
				if (err.response && err.response.status === 401) {
					return null;
				}
				toast.error(err.response.data.message || "Something went wrong");
			}
		},
	});

	if (isLoading) return <div className="flex justify-center items-center min-h-screen"><Loader className="animate-spin" /></div>;

	return (
		<>
			<GoogleOAuthProvider clientId={clientId}>
				<TestProvider>
					<Routes>
						<Route element={<Layout />}>
							<Route path='/' element={authUser ? <HomePage /> : <Navigate to={"/landingpage"} />} />
							<Route path='/signup/:type' element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />} />
							<Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to={'/'} />} />
							<Route path='/notifications' element={authUser ? <NotificationsPage /> : <Navigate to={"/login"} />} />
							<Route path='/network' element={authUser ? <NetworkPage /> : <Navigate to={"/login"} />} />
							<Route path='/events' element={authUser ? <Events /> : <Navigate to={"/login"} />} />
							<Route path='/event/:eventId' element={authUser ? <EventDetail /> : <Navigate to={"/login"} />} />
							<Route path='/post/:postId' element={authUser ? <PostPage /> : <Navigate to={"/login"} />} />
							<Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />} />
							<Route path='/resetPassword' element={authUser ? <HomePage /> : <ResetPassword />} />
							<Route path='/messages' element={authUser ? <MessageRoom /> : <Navigate to={"/"} />} />
							<Route path='/internships' element={authUser ? <Internship /> : <Navigate to={"/"} />} />
						</Route>
						<Route path="/landingpage" element={<NewLandingPage />} />
						<Route path="/type" element={!authUser ? <LandingPage /> : <Navigate to='/' />} />
						<Route path="/aiguru" element={<AIGuru />}>
							<Route path="" element={<Home />} />
							<Route path="settings" element={<Settings />} />
						</Route>

						<Route path="/aiskill" element={<AISkillTestPage />}>
							<Route path="assessment" element={<Assessment />} />
							<Route path="test" element={<TestInterface />} />
							<Route path="results" element={<Results />} />
							<Route path="recommendations" element={<Recommendations />} />
							<Route path="progress" element={<Progress />} />
							<Route path="certificate" element={<Certificate />} />
						</Route>
					</Routes>
				</TestProvider>
				<Toaster />
			</GoogleOAuthProvider>
		</>
	);
}

export default App;

