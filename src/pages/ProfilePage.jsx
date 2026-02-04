import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

import toast from "react-hot-toast";
import Certificate from "../components/profileComponents/Certificate";
import Course from "../components/profileComponents/Course";
import Education from "../components/profileComponents/Education";
import Experience from "../components/profileComponents/Experience";
import InternshipProfile from "../components/profileComponents/InternshipProfile";
import Posts from "../components/profileComponents/Posts";
import ProfileHeader from "../components/profileComponents/ProfileHeader";
import Skill from "../components/profileComponents/Skill";


const ProfilePage = () => {
  const { username } = useParams();
  const queryClient = useQueryClient();

  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
  });

  const { data: userProfile, isLoading: isUserProfileLoading } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: () => axiosInstance.get(`/users/${username}`),
  });

  const { mutate: updateProfile } = useMutation({
    mutationFn: async (updatedData) => {
      await axiosInstance.put("/users/profile", updatedData);
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries(["userProfile", username]);
    },
  });

  if (isLoading || isUserProfileLoading) return null;

  const isOwnProfile = authUser.username === userProfile.data.username;
  const userData = isOwnProfile ? authUser : userProfile.data;

  const handleSave = (updatedData) => {
    updateProfile(updatedData);
  };

  console.log("User Data Profile Page:",userData)

  return (
    <div className="max-w-4xl mx-auto sm:p-4">
      <ProfileHeader userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
      <Posts user={userData}/>
      <Skill user={userData} isOwnProfile={isOwnProfile}/>
      <Education user={userData} isOwnProfile={isOwnProfile}/>
      <Certificate user={userData} isOwnProfile={isOwnProfile}/>
      {
        userData.type === 'Provider' && (
       <>
          <Experience user={userData} isOwnProfile={isOwnProfile}/>
          <Course user={userData} isOwnProfile={isOwnProfile}/>
          <InternshipProfile user={userData} isOwnProfile={isOwnProfile}/>
       </>
        )
      }

    </div>
  );
};

export default ProfilePage;

