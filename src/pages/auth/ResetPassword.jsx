import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState(null);
  const [isLoading, setIsloading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [sentOtp, setSentOtp] = useState(false);

  const sendOtp = async () => {
    try {
      if (!email.trim()) return toast('Please enter your email');
      setIsloading(true);
      const res = await axios.post("https://cwt-net-backend.vercel.app/api/v1/auth/sendOtp", { email: email }, { withCredentials: true });
      if (res) {
        toast.success(res.data.message);
        setSentOtp(true);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something wend wrong. Try again");
      setSentOtp(false);
    } finally {
      setIsloading(false);
    }
  }

  const ResetPassword = async(e) => {
    e.preventDefault();
    if(!email || !otp) return toast.error('Check otp or email');
    if(!newPassword) return toast.error('Invalid password');
    try {
      setIsloading(true);
      const res=await axios.post("https://cwt-net-backend.vercel.app/api/v1/auth/resetPassword",{email,otp,newPassword},{withCredentials:true});
      if(res){
         toast.success(res.data.message);
         navigate('/login');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something wend wrong. Try again");
    }finally{
      setIsloading(false);
    }
  };

  const handleResendOtp=()=>{
    setOtp("");
    setNewPassword("");
  }
  return (
    <div className="w-full flex justify-center items-center min-h-[80vh] text-justify">
      {
        !sentOtp ? <div className="w-[440px] border border-black p-4 flex flex-col gap-3 rounded-xl bg-white shadow-[8px_8px_10px_rgba(107,114,128,0.5)]">
          <h1 className="text-[#000000] text-2xl font-bold">Forgot Password</h1>
          <input type="text" value={email} onChange={(e) =>setEmail(e.target.value)} placeholder="Email or phone" className="text-[#666666] p-3 border border-black rounded-lg" />
          <p className="px-6 text-[#000000] text-center">We’ll send a verification code to this email or phone number if it matches an existing <span className="text-black font-bold">CWTNet</span> account.</p>

          {
            isLoading ? <button className="bg-[#5b58f7] w-[60%] mx-auto py-2 rounded-lg text-white"><LoaderCircle className="animate-spin mx-auto" /></button> :
              <button onClick={sendOtp} className="bg-[#6E6BF5] hover:bg-[#5b58f7] w-[60%] mx-auto py-2 rounded-lg text-white">Next</button>
          }

          <button onClick={() => navigate('/login')} className="text-center cursor-pointer hover:font-semibold font-semibold">Back</button>
        </div> :
          <div className="w-[440px] border border-black p-4 flex flex-col gap-3 rounded-xl bg-white shadow-[8px_8px_10px_rgba(107,114,128,0.5)]">
            <h1 className="text-[#000000] text-2xl font-bold">Reset Password</h1>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="text-[#666666] p-3 border border-black rounded-lg"
            />
            <p onClick={handleResendOtp} className="text-blue-700 hover:text-blue-800 cursor-pointer">Resend OTP</p>
            <input
              type="password"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="text-[#666666] p-3 border border-black rounded-lg"
            />

            {
              isLoading ? <button className="bg-[#5b58f7] w-[60%] mx-auto py-2 rounded-lg text-white"><LoaderCircle className="animate-spin mx-auto" /></button> :
                <button
                  onClick={ResetPassword}
                  className="bg-[#6E6BF5] hover:bg-[#5b58f7] w-[60%] mx-auto py-2 rounded-lg text-white"
                >
                  Submit
                </button>
            }
            <button
              onClick={() => navigate('/login')}
              className="text-center cursor-pointer hover:font-semibold font-semibold"
            >
              Back
            </button>
          </div>
      }
    </div>
  )
}

export default ResetPassword