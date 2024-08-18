import { AxiosResponse } from "axios";
import axiosInstance from "./config";

export const acceptPartnerRequest = async (
  userId: string
): Promise<AxiosResponse<any, any>> => {
  try {
    const response = await axiosInstance.post("/api/acceptPartner", {
      userId,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
