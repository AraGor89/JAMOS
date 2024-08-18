import {
  PartnerT,
  NotificationT,
  CharacteristicT,
  // NotificationTypeE,
} from "@/types/common";
import mongoose, { Schema, Document } from "mongoose";

export interface UserDocument extends Document {
  name: string;
  surname: string;
  email: string;
  password: string;
  photo?: string;
  partners?: Array<PartnerT>;
  notifications?: Array<NotificationT>;
  characteristics?: Array<CharacteristicT>;
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    surname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      // select: false,
    },
    photo: {
      type: String,
    },
    characteristics: {
      // type: [Schema.Types.Mixed],
      type: [
        {
          character: { type: String, trim: true },
          value: { type: Number },
          createdBy: { type: String, required: true },
          updatedBy: { type: String },
          createdAt: {
            type: Date,
            default: Date.now,
          },
          updatedAt: { type: Date },
        },
      ],
    },
    partners: {
      type: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            // required: true,
          },
          status: {
            type: String,
            // required: true,
            enum: ["pending", "accepted", "rejected"],
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
    notifications: {
      type: [
        {
          type: {
            type: String,
            // required: true,
            enum: ["partnerRequest", "partnerExcept", "characteristicChange"], // Object.values(NotificationTypeE),
          },
          content: {
            type: Schema.Types.Mixed,
            required: true,
            trim: true,
          },
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
  },
  { timestamps: true }
);

const User =
  mongoose.models.User || mongoose.model<UserDocument>("User", userSchema);

export default User;
