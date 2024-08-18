import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import User from "@/models/user";
import connectMongodb from "@/libs/mongoDB";
import { authOptions } from "../auth/[...nextauth]/route";
import { addCharacteristicValidationSchema } from "@/validators";
import { NotificationTypeE, PartnerStatusE, UserT } from "@/types/common";

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);

  try {
    const req = await request.json();
    await connectMongodb();

    // Find the logged-in user
    const currentUser: UserT | null = await User.findById(session?.user._id);
    // Find the user to send the partner request to
    // const targetUser: UserT | null = await User.findById(req?.userId);
    const isSelfProfile = currentUser?._id?.toString() === req?.userId;
    const partnerProfile = currentUser?.partners.find(
      (item) => item.status === PartnerStatusE.accepted
    );

    const isPartnerProfile = partnerProfile?.user.toString() === req.userId;

    if (!req.userId || !currentUser) {
      throw new Error("User is not found");
    }

    if (!isSelfProfile && !isPartnerProfile) {
      throw new Error("You have no permission for this action");
    }

    await addCharacteristicValidationSchema.validate(req.characteristic, {
      abortEarly: false,
    });

    const user = await User.updateOne(
      { _id: req.userId },
      {
        $push: {
          characteristics: {
            ...req.characteristic,
            createdBy: `${currentUser.name} ${currentUser.surname}`,
          },
        },
      },
      { new: true }
    );

    if (!!partnerProfile?.user) {
      const targetUserUpdate = await User.updateOne(
        { _id: partnerProfile?.user },
        {
          $push: {
            notifications: {
              type: NotificationTypeE.characteristicCreation,
              content: `${currentUser.name} created a characteristic '${req.characteristic.character}' with a value ${req.characteristic.value}`,
              user: session?.user._id,
            },
          },
        }
      );
    }

    if (user) {
      return NextResponse.json(
        { message: "Characteristic is created successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Could not create characteristic" },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.log("error", error);
    if (error.name === "ValidationError") {
      return NextResponse.json({ message: error?.errors }, { status: 400 });
    } else {
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  }
}
