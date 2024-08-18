import axiosInstance from "./config";
import { SignupFormT, UserT } from "@/types/common";

export const editUserProfile = async (
  formData: SignupFormT
): Promise<UserT> => {
  try {
    const response = await axiosInstance.put("/api/editProfile", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
