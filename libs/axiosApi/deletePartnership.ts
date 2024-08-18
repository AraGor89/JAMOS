import { AxiosResponse } from "axios";
import axiosInstance from "./config";

export const deletePartnership = async (
  partnerId: string
): Promise<AxiosResponse<any, any>> => {
  try {
    const response = await axiosInstance.put("/api/deletePartnership", {
      partnerId,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
