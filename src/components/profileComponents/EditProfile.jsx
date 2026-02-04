import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { LoaderCircleIcon, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const EditProfile = ({ userData, onClose }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name:userData.name,
    phone:userData.phone,
    headline:userData.headline,
    location:userData.location,
    bio:userData.bio,
    about:userData.about,
    universityName:userData.universityName || ''
  });

  const [updating,setUpdating]=useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async() => {
    try {
        setUpdating(true);
        if(!formData.name || formData.name==='') return toast.error("Name field is required");
        const res=await axios.post("http://localhost:5000/api/v1/users/updateProfile",formData,{withCredentials:true});
        if(res){
            toast.success(res.data.message);
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong. Try again");
    }finally{
        setUpdating(false);
    }
    onClose(); // Close modal after save
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-xl font-semibold">Edit Profile</h2>
          <X className="cursor-pointer text-gray-500 hover:text-gray-700" onClick={onClose} />
        </div>

        {/* Input Fields */}
        <div className="space-y-3">
          {["name", "phone", "headline","universityName", "location", "bio", "about"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium capitalize">{field==='universityName' ? 'University/Institution Name' : field}</label>
              <input
                type="text"
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        {/* Save Button */}
        {
            updating ? <button
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-center"
          >
           <LoaderCircleIcon className="animate-spin mx-auto"/>
          </button> :
               <button
               onClick={handleSave}
               className="mt-4 w-full bg-blue-600 text-white py-2 cursor-pointer rounded-lg hover:bg-blue-700"
             >
               Save Changes
             </button>
        }
   
      </div>
    </div>
  );
};

export default EditProfile;