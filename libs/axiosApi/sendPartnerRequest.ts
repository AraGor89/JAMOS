import { AxiosResponse } from "axios";
import axiosInstance from "./config";

export const sendPartnerRequest = async (
  userId: string
): Promise<AxiosResponse<any, any>> => {
  try {
    const response = await axiosInstance.post("/api/requestPartner", {
      userId,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
