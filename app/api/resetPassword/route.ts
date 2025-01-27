import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

import User from "@/models/user";
import connectMongodb from "@/libs/mongoDB";
import { resetPassValidationSchema } from "@/validators";

var jwt = require("jsonwebtoken");

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.json();
    await connectMongodb();

    await resetPassValidationSchema.validate(formData, {
      abortEarly: false,
    });

    const { id, token } = formData;
    const oldUser = await User.findOne({ _id: id });

    if (!oldUser) {
      return NextResponse.json(
        { message: "Account is not found" },
        { status: 404 }
      );
    }

    const { password, email, _id } = oldUser;
    const secret = process.env.NEXTAUTH_SECRET + password;
    try {
      const verify = jwt.verify(token, secret);
      const hashedPassword = await bcrypt.hash(formData.password, 10);
      const user = await User.updateOne(
        { _id: _id },
        { $set: { password: hashedPassword } },
        { new: true }
      );
      return NextResponse.json(
        { message: "The password has been successfully updated." },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Failed to update password. Please try again later" },
        { status: 400 }
      );
    }
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
