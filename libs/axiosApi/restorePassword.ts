import { AxiosResponse } from "axios";
import axiosInstance from "./config";

export const restorePassword = async (
  email: string
): Promise<AxiosResponse<any, any>> => {
  try {
    const response = await axiosInstance.post("/api/restorePassword", {
      email,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
