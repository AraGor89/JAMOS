import { toast } from "react-hot-toast";
import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

// const baseURL = "YOUR_API_BASE_URL"; // Replace with your actual API base URL

const axiosInstance: AxiosInstance = axios.create({
  // baseURL,
  timeout: 10000, // Adjust the timeout as needed
  headers: {
    "Content-Type": "application/json",
    // Add any additional headers you need
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig<any>) => {
    // You can modify the request config here (e.g., adding authentication headers)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const isSomeActionUrl = (url: string) => {
  return (
    url.includes("create") || url.includes("delete") || url.includes("edit")
  );
};

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    const { url } = response.config;
    if (isSomeActionUrl(url as string)) {
      toast.success(response?.data?.message || "Success");
    }
    return response;
  },
  (error) => {
    const { url } = error.config;
    if (isSomeActionUrl(url)) {
      const err = error?.response?.data?.message || "Something went wrong";
      if (Array.isArray(err)) {
        err.map((errItemMessage) => toast.error(errItemMessage));
      } else {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    } else {
      toast.error("Something went wrong");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
