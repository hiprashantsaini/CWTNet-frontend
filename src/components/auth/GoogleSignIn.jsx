import { GoogleLogin } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const GoogleSignIn = () => {
    const { type } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await axios.post("http://localhost:5000/api/v1/auth/google-signin", {
                token: credentialResponse.credential,
                type: type, // Or "Provider" (send based on user type)
            }, { withCredentials: true });

            if (res) {
                queryClient.invalidateQueries({ queryKey: ["authUser"] });
                toast.success(res.data.message)
            }
        } catch (error) {
            if (error.response?.data?.message === 'missedProfileType') {
                toast("Select your profile type");
                return navigate('/type');
            }
            console.error("Google Sign-In Error:", error);
        }
    };

    return (
        <div>
         <div className="flex justify-center">
            <GoogleLogin
                type="standard"
                theme="outline"
                text="continue_with"
                shape="rectangular"
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google Sign-In Failed")}
            />
        </div>

        </div>
    );
};

export default GoogleSignIn;