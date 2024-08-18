import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import User from "@/models/user";
import connectMongodb from "@/libs/mongoDB";
import { PartnerStatusE, UserT } from "@/types/common";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  try {
    const req = await request.json();

    await connectMongodb();

    if (!req.userId) {
      throw new Error("User Id is not provided");
    }

    const currentUser: UserT | null = await User.findById(session?.user._id);
    const targetUser: UserT | null = await User.findById({ _id: req.userId });

    const isCurrentUserPage = session?.user?._id === req?.userId;
    const partnerPagePartners = currentUser?.partners.filter(
      (partner) => partner?.user?.toString() === req.userId
    );

    if (!targetUser) {
      return NextResponse.json({ user: "User is not found" }, { status: 404 });
    }

    if (isCurrentUserPage) {
      return NextResponse.json({ user: targetUser }, { status: 200 });
    }

    if (!!partnerPagePartners) {
      return NextResponse.json(
        {
          user: {
            name: targetUser.name,
            photo: targetUser.photo,
            surname: targetUser.surname,
            partners: partnerPagePartners,
            _id: targetUser._id,
            characteristics: targetUser.characteristics,
          },
        },
        { status: 200 }
      );
    }

    if (!isCurrentUserPage && !partnerPagePartners) {
      return NextResponse.json(
        {
          user: {
            name: targetUser.name,
            photo: targetUser.photo,
            surname: targetUser.surname,
            _id: targetUser._id,
          },
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.log("error", error);
  }
}
