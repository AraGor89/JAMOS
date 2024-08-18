import { SvgIconProps } from "@mui/material";
import { ReactNode } from "react";

export type CharacteristicT = {
  character: string;
  value: number;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CharacteristicFormT = Omit<
  CharacteristicT,
  "createdAt" | "updatedAt" | "createdBy" | "updatedBy"
>;

export type SignupFormT = {
  name: string;
  surname: string;
  email: string;
  partnerEmail?: string;
  password: string;
  // photo?: FileList; // | string;
};

export enum NotificationTypeE {
  partnerExcept = "partnerExcept",
  partnerReject = "partnerReject",
  partnerRequest = "partnerRequest",
  characteristicChange = "characteristicChange",
  characteristicCreation = "characteristicCreation",
  characteristicDeletion = "characteristicDeletion",
}

export enum NotificationComponentType {
  menu = "menu",
  page = "page",
}

export type NotificationContentT = string | { [key: string]: number };

export type NotificationT = {
  type: NotificationTypeE;
  content: NotificationContentT;
  user: string;
  createdAt: Date;
  _id: string;
};

export enum PartnerStatusE {
  pending = "pending",
  accepted = "accepted",
  rejected = "rejected",
}

export type PartnerT = {
  user: string;
  status: PartnerStatusE;
  createdAt: Date;
  _id: string;
};

export type UserT = {
  email: string;
  name: string;
  photo?: string;
  surname: string;
  password: string;
  partners: PartnerT[];
  notifications: NotificationT[];
  characteristics: CharacteristicT[];
  createdAt: Date;
  updatedAt: Date;
  _id: string;
};

export type ResetPasswordFormT = {
  password: string;
  confirmPassword: string;
};

export type ResetPasswordFormAndUrlParamsT = ResetPasswordFormT & {
  id: string;
  token: string;
};

export type PathT = {
  name: string;
  path: string;
  type: string;
  isSelected: boolean;
  component?: ReactNode;
  icon?: ReactNode // React.ComponentType<SvgIconProps>;
};
