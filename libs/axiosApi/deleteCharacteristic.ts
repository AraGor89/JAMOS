import { AxiosResponse } from "axios";
import axiosInstance from "./config";

export const deleteCharacteristic = async (
  userId: string,
  characteristicName: string
): Promise<AxiosResponse<any, any>> => {
  try {
    const response = await axiosInstance.put("/api/deleteCharacteristic", {
      userId,
      characteristicName,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
