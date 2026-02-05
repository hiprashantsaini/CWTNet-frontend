import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { CameraIcon, Edit2Icon } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

import NProgress from "nprogress";
import "nprogress/nprogress.css";
import EditProfile from "./EditProfile";
// Configure NProgress
NProgress.configure({
    showSpinner: false,  // Optional: hide the spinner
    minimum: 0.3,        // How much to show initially
    trickleSpeed: 200    // Speed of progress
});
const ProfileHeader = ({userData,isOwnProfile}) => {
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    const queryClient = useQueryClient();
    const bannerRef = useRef();
    const imageRef = useRef();

    const [showEdit,setShowEdit]=useState(false);

    const changeBanner = () => {
        bannerRef.current.click();
    }
    const changeProfileImage = () => {
        imageRef.current.click();
    }

    const handleBannerChange = async (e, url) => {
        e.preventDefault();
        try {
            const file = e.target.files[0];
            if (!file) return toast.error("Seletct the file");

            NProgress.start();
            // Convert file to base64 using FileReader
            const reader = new FileReader();
            reader.readAsDataURL(file); // Start reading file

            reader.onload = async () => { // Fires when file is fully read
                const image = reader.result;
                const res = await axios.post(`https://cwt-net-backend.vercel.app/api/v1/users/${url}`, { image }, { withCredentials: true });
                if (res) {
                    toast.success(res.data?.message);
                    queryClient.invalidateQueries({ queryKey: ["authUser"] });
                    NProgress.done();
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong. Try again");
            NProgress.done();
        }
    }

    const handleEdit=()=>{
       setShowEdit(true);
    }

    const onClose=()=>{
        setShowEdit(false);
    }
    return (
        <div className="w-full bg-white relative">
            {
                (authUser._id === userData._id) && (
                    <>
                    <div className="absolute right-4 top-56" title="Edit Profile">
                    <Edit2Icon onClick={handleEdit} className="size-5 hover:text-red-600 cursor-pointer"/>
                   </div>
                       {
                        showEdit && <EditProfile userData={authUser} onClose={onClose}/>
                    }
                    </>
                )
            }
            <div className="relative w-full h-44 mb-20">
                <img src={userData.bannerImg} className="w-full h-full object-cover" />
                <div className="w-32 h-32 absolute rounded-full ml-2 top-32">
                    <img src={userData.profilePicture} className="w-full h-full rounded-full" />
                    {isOwnProfile && <div onClick={changeProfileImage}  title="Edit Profile Picture" className="w-32 h-32 flex justify-center items-center absolute rounded-full inset-0 opacity-0 hover:opacity-100 cursor-pointer bg-white bg-opacity-0 hover:bg-opacity-50">
                        <CameraIcon className="m-auto" />
                    </div>}
                </div>
                {isOwnProfile && <div onClick={changeBanner} title="Update Banner Image" className="w-12 h-12 flex justify-center items-center absolute rounded-full right-3 -bottom-3 opacity-30 hover:opacity-100 cursor-pointer bg-white bg-opacity-60">
                    <CameraIcon className="m-auto" />
                </div>}
                <input type="file" hidden accept="image/*" ref={bannerRef} onChange={(e) => handleBannerChange(e, "changeBanner")} />
                <input type="file" hidden accept="image/*" ref={imageRef} onChange={(e) => handleBannerChange(e, "changeProfileImage")} />
            </div>
            <div className="px-4">
                <div className="flex justify-between">
                    <p className="font-semibold text-lg">{userData.name} <spna className="pl-1 text-gray-500 text-sm font-normal">{userData.type}</spna></p>
                    <p className="font-semibold text-lg">{userData. universityName}</p>
                </div>
                <p>{userData.bio}</p>
                <p>{userData.location}</p>
                <hr className="border border-gray-500 my-2"/>
                <h2 className="font-bold">About</h2>
                <p className="text-justify pb-2">{userData.about}</p>
                <p className="text-justify pb-2 font-semibold font-mono"><spna className="font-semibold">Email :</spna>{userData.email}</p>
                <p className="text-justify pb-2 font-semibold font-mono"><spna className="font-semibold">Phone :</spna>{userData.phone}</p>
            </div>
        </div>
    )
}

export default ProfileHeader