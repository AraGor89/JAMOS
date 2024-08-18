import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import User from "@/models/user";
import connectMongodb from "@/libs/mongoDB";
import { authOptions } from "../auth/[...nextauth]/route";
import {
  UserT,
  PartnerT,
  PartnerStatusE,
  NotificationTypeE,
} from "@/types/common";

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);

  try {
    const req = await request.json();
    await connectMongodb();
    // Find the logged-in user
    // const currentUser: UserT | null = await User.findById(session?.user._id);
    // Find partner
    // const partnerUser: UserT | null = await User.findById(req?.partnerId);

    if (!session?.user._id || !req?.partnerId) {
      return NextResponse.json(
        { message: "User is not found" },
        { status: 404 }
      );
    }

    const currentUser = await User.findOneAndUpdate(
      { _id: session?.user._id },
      {
        $pull: { partners: { user: req.partnerId } },
        $set: { characteristics: [], notifications: [] },
      },
      { new: true }
    );

    const partnerUser = await User.findOneAndUpdate(
      { _id: req.partnerId },
      {
        $pull: { partners: { user: session?.user._id } },
        $set: { characteristics: [], notifications: [] },
      },
      { new: true }
    );

    if (!currentUser || !partnerUser) {
      return NextResponse.json(
        { message: "User is not found" },
        { status: 404 }
      );
    }

    const isHeMyPartner = currentUser.partners.find(
      (item: PartnerT) => item?.user.toString() === req?.partnerId
    );
    const amiHisPartner = partnerUser.partners.find(
      (item: PartnerT) => item?.user.toString() === session?.user?._id
    );

    if (!isHeMyPartner && !amiHisPartner) {
      return NextResponse.json(
        { message: "Partnership is deleted successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Could not delete Partnership" },
        { status: 404 }
      );
    }
    // if (!!partnerProfile?.user) {
    //   const targetUserUpdate = await User.updateOne(
    //     { _id: partnerProfile?.user },
    //     {
    //       $push: {
    //         notifications: {
    //           type: NotificationTypeE.characteristicDeletion,
    //           content: `${currentUser.name} deleted the characteristic '${req.characteristicName}'`,
    //           user: session?.user._id,
    //         },
    //       },
    //     }
    //   );
    // }
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
