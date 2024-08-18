import { AxiosResponse } from "axios";
import axiosInstance from "./config";
import { CharacteristicFormT } from "@/types/common";

export const addCharacteristics = async (
  userId: string,
  characteristic: CharacteristicFormT
): Promise<AxiosResponse<any, any>> => {
  try {
    const response = await axiosInstance.put("/api/createCharacteristic", {
      userId,
      characteristic,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
