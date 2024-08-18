import path from "path";
import * as fs from "fs";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";

import User from "@/models/user";
import connectMongodb from "@/libs/mongoDB";
import { signupValidationSchema } from "@/validators";
import { CharacteristicT, NotificationT, PartnerT } from "@/types/common";

// TODO: delete or edit at the end
const mockChars: CharacteristicT | [] = [
  // {
  //   character: "Accessible",
  //   value: 80,
  // },
  // {
  //   character: "Alert",
  //   value: 35,
  // },
];

const transporter: nodemailer.Transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.net",
  port: 587,
  secure: true,
  auth: {
    user: process.env.EMAIL_APP_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const sendInvitationEmail = async (transporter: any, options: any) => {
  try {
    await transporter.sendMail(options);
    console.log("email has been sent");
  } catch (error) {
    console.log("error", error);
  }
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    await connectMongodb();

    await signupValidationSchema.validate(formData, {
      abortEarly: false,
    });

    const isUserExist = await User.findOne({ email: formData.email });
    if (isUserExist) {
      return NextResponse.json(
        { message: "Email is already in use" },
        { status: 422 }
      );
    }

    const hashedPassword = await bcrypt.hash(formData.password, 10);
    const newUser = await User.create({
      ...formData,
      photo: formData?.photo || "",
      password: hashedPassword,
      characteristics: formData?.characteristics || mockChars,
      partners: [] as unknown as PartnerT,
      notifications: [] as unknown as NotificationT,
    });

    if (!!formData.partnerEmail) {
      const senderFullName = `${newUser.name} ${newUser.surname}`;
      const options = formMailOptions(
        newUser._id,
        senderFullName,
        formData.partnerEmail
      );
      sendInvitationEmail(transporter, options);
    }

    return NextResponse.json({ message: "User created" }, { status: 201 });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      // console.log("error", error.errors);
      return NextResponse.json({ message: error?.errors }, { status: 400 });
    } else {
      console.log("error", error);
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  }
}

function formMailOptions(
  senderId: string,
  senderFullName: string,
  receiverEmail: string
) {
  return {
    from: {
      name: "JAMOS",
      address: process.env.EMAIL_APP_USER,
    },
    to: [receiverEmail],
    subject: "Invitation to JAMOS",
    html: `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invitation</title>
</head>
<body style="font-family: Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
    <h2 style="color: #333;">Invitation to JAMOS</h2>
    <p>Greetings</p>
    <p>${senderFullName} invites you to join JAMOS as a partner.</p>
    <p>You can fined the profile page of ${senderFullName} and request partnership via <a target='blank' href="${process.env.NEXTAUTH_URL}/profile/${senderId}">this link</a></p>
    <a target='blank' href="${process.env.NEXTAUTH_URL}"><strong>More about JAMOS here</strong> </a>
    
    <p>We would be delighted to have you with us!</p>
    <p>Best regards,<br>JAMOS team</p>
  </div>
</body>
</html>
  `,
  };
}
