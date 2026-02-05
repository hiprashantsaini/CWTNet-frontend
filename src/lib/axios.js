import axios from "axios";

export const axiosInstance = axios.create({
	baseURL: import.meta.env.MODE === "development" ? "https://cwt-net-backend.vercel.app/api/v1" : "/api/v1",
	withCredentials: true,
});
