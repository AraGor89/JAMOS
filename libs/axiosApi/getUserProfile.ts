import axiosInstance from "./config";
import { UserT } from "@/types/common";

export const fetchUserProfile = async (userId: string): Promise<UserT> => {
  try {
    const response = await axiosInstance.post("/api/profile", { userId });
    return response?.data?.user; // Assuming the user profile data is in the 'data' property
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error or handle it appropriately
  }
};
