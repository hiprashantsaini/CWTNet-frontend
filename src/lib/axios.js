import axios from "axios";

export const axiosInstance = axios.create({
	baseURL:"https://cwt-net-backend.vercel.app/api/v1",
	withCredentials: true,
});
