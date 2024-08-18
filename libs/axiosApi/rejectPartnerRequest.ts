import { AxiosResponse } from "axios";
import axiosInstance from "./config";

export const rejectPartnerRequest = async (
  userId: string
): Promise<AxiosResponse<any, any>> => {
  try {
    const response = await axiosInstance.post("/api/rejectPartner", {
      userId,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
