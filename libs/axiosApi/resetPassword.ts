import { AxiosResponse } from "axios";
import axiosInstance from "./config";
import { ResetPasswordFormT } from "@/types/common";

export const resetPassword = async (
  formData: ResetPasswordFormT
): Promise<AxiosResponse<any, any>> => {
  try {
    const response = await axiosInstance.put("/api/resetPassword", formData);
    return response;
  } catch (error) {
    throw error;
  }
};
