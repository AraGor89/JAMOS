import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import User from "@/models/user";
import connectMongodb from "@/libs/mongoDB";
import { authOptions } from "../auth/[...nextauth]/route";
import { NotificationTypeE, PartnerStatusE, UserT } from "@/types/common";

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  console.log("session", session);
  try {
    // throw new Error("Characteristic is not found");
    const req = await request.json();
    // Find the logged-in user
    await connectMongodb();
    const currentUser: UserT | null = await User.findById(session?.user._id);

    // const targetUser = await User.findById(req?.userId);
    // const isSelfProfile = currentUser?._id?.toString() === req?.userId;
    const isSelfProfile = currentUser?._id?.toString() === req?.userId;
    const partnerProfile = currentUser?.partners.find(
      (item) => item.status === PartnerStatusE.accepted
    );

    const isPartnerProfile = partnerProfile?.user.toString() === req.userId;

    console.log("req", req);
    console.log("currentUser", currentUser);
    if (!req.userId || !currentUser) {
      throw new Error("User is not found");
    }

    if (!req.characteristicName) {
      throw new Error("Characteristic is not found");
    }

    if (!isSelfProfile && !isPartnerProfile) {
      throw new Error("You have no permission for this action");
    }

    const user = await User.updateOne(
      { _id: req.userId },
      { $pull: { characteristics: { character: req.characteristicName } } }
    );

    if (!!partnerProfile?.user) {
      const targetUserUpdate = await User.updateOne(
        { _id: partnerProfile?.user },
        {
          $push: {
            notifications: {
              type: NotificationTypeE.characteristicDeletion,
              content: `${currentUser.name} deleted the characteristic '${req.characteristicName}'`,
              user: session?.user._id,
            },
          },
        }
      );
    }

    if (user) {
      return NextResponse.json(
        { message: "Characteristic is deleted successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Could not delete characteristic" },
        { status: 404 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
