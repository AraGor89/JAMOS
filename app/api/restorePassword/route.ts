import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";

import User from "@/models/user";
import connectMongodb from "@/libs/mongoDB";
import { emailValidationSchema } from "@/validators";

var jwt = require("jsonwebtoken");

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

    await emailValidationSchema.validate(formData, {
      abortEarly: false,
    });

    const oldUser = await User.findOne({ email: formData.email });

    if (!oldUser) {
      return NextResponse.json(
        { message: "Account is not found" },
        { status: 404 }
      );
    }

    const { password, email, _id } = oldUser;
    const secret = process.env.NEXTAUTH_SECRET + password;
    const token = jwt.sign({ email, _id }, secret, { expiresIn: "5m" });

    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password/${_id}/${token}`;
    if (email) {
      const options = formMailOptions(resetLink, "JAMOS team", email);
      sendInvitationEmail(transporter, options);
    }

    return NextResponse.json(
      {
        message:
          "The password`s recovery link has been sent to your email, check it out please.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.name === "ValidationError") {
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
  resetLink: string,
  senderFullName: string,
  receiverEmail: string
) {
  return {
    from: {
      name: "JAMOS",
      address: process.env.EMAIL_APP_USER,
    },
    to: [receiverEmail],
    subject: "Reset password",
    html: `
  <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invitation</title>
        </head>
        <body style="font-family: Arial, sans-serif;">
            <div style="max-width: 600px;  padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <p>Greetings</p>
                <p>Please follow <a target='blank' href="${resetLink}">this</a> link to reset your password.</p>
                <p>The link will be valid for 5 minutes.</p>
                <a target='blank' href="${process.env.NEXTAUTH_URL}"><strong>More about JAMOS here</strong> </a>
                <p>We would be delighted to have you with us!</p>
                <p>Best regards,<br>${senderFullName}</p>
            </div>
        </body>
    </html>
  `,
  };
}
