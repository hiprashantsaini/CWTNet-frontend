import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../lib/axios.js";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    otp: ""
  });
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [timer, setTimer] = useState(0);
  const [sendingOtp,setSendingOtp]=useState(false);

  const { type } = useParams();
  const queryClient = useQueryClient();

  // Send OTP mutation
  const { mutate: sendOtpMutation, isLoading: isSendingOtp } = useMutation({
    mutationFn: async (email) => {
      setSendingOtp(true);
      const res = await axiosInstance.post("/auth/send-otp", { email });
      return res.data;
    },
    onSuccess: () => {
      toast.success("OTP sent to your email");
      setSendingOtp(false);
      setIsOtpSent(true);
      startResendTimer();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to send OTP");
      setSendingOtp(false);
    }
  });
  console.log("isSendingOtp :",isSendingOtp)

  // Verify OTP mutation
  const { mutate: verifyOtpMutation, isLoading: isVerifyingOtp } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/auth/verify-otp", {
        email: formData.email,
        otp: data.otp
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Email verified successfully");
      setIsOtpVerified(true);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Invalid OTP");
    }
  });

  // Sign up mutation
  const { mutate: signUpMutation, isLoading: isSigningUp } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/auth/signup", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  });

  const startResendTimer = () => {
    setIsResendDisabled(true);
    setTimer(50);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = () => {
    if (!formData.email) {
      toast.error("Please enter your email");
      return;
    }
    sendOtpMutation(formData.email);
  };

  const handleVerifyOtp = () => {
    if (!formData.otp) {
      toast.error("Please enter OTP");
      return;
    }
    verifyOtpMutation({ otp: formData.otp });
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!isOtpVerified) {
      toast.error("Please verify your email first");
      return;
    }
    signUpMutation({ ...formData, type });
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSignUp} className="flex flex-col gap-4">
      <input
        type="text"
        name="name"
        placeholder="Full name"
        value={formData.name}
        onChange={handleChange}
        className="input input-bordered w-full"
        required
      />
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        className="input input-bordered w-full"
        required
      />
      <div className="relative">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
          disabled={isOtpVerified}
        />
        {isOtpVerified ? (
          <CheckCircle className="absolute right-3 top-3 text-green-500" />
        ) : (
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={isSendingOtp || isResendDisabled}
            className="absolute right-2 top-2 btn btn-sm"
          >
            {sendingOtp ? (
              <Loader className="size-4 animate-spin" />
            ) : isResendDisabled ? (
              `Resend in ${timer}s`
            ) : isOtpSent ? (
              "Resend OTP"
            ) : (
              "Send OTP"
            )}
          </button>
        )}
      </div>

      {isOtpSent && !isOtpVerified && (
        <div className="relative">
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={formData.otp}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
          <button
            type="button"
            onClick={handleVerifyOtp}
            disabled={isVerifyingOtp}
            className="absolute right-2 top-2 btn btn-sm"
          >
            {isVerifyingOtp ? (
              <Loader className="size-4 animate-spin" />
            ) : (
              "Verify OTP"
            )}
          </button>
        </div>
      )}

      <input
        type="password"
        name="password"
        placeholder="Password (6+ characters)"
        value={formData.password}
        onChange={handleChange}
        className="input input-bordered w-full"
        required
      />

      <p className="p text-center">
        By clicking Continue to join or sign in, you agree to EduVerse's{" "}
        <span className="text-[#110CF6] font-bold cursor-pointer">
          User Agreement, Privacy Policy
        </span>
        , and{" "}
        <span className="text-[#110CF6] font-bold cursor-pointer">
          Cookie Policy.
        </span>
      </p>

      <button
        type="submit"
        disabled={isSigningUp || !isOtpVerified}
        className="btn btn-primary w-full text-white"
      >
        {isSigningUp ? (
          <Loader className="size-5 animate-spin" />
        ) : (
          "Agree & Join"
        )}
      </button>
    </form>
  );
};

export default SignUpForm;
