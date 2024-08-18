import axiosInstance from "./config";
import { SignupFormT, UserT } from "@/types/common";

export const createUserProfile = async (
  formData: SignupFormT
): Promise<UserT> => {
  try {
    const response = await axiosInstance.post("/api/signup", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
