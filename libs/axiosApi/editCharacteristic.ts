import { AxiosResponse } from "axios";
import axiosInstance from "./config";
import { CharacteristicFormT } from "@/types/common";

export const editCharacteristics = async (
  userId: string,
  characteristic: CharacteristicFormT
): Promise<AxiosResponse<any, any>> => {
  try {
    const response = await axiosInstance.post("/api/editCharacteristic", {
      userId,
      characteristic,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
