import User from "@/models/user";
import connectMongodb from "@/libs/mongoDB";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import {
  NotificationT,
  PartnerStatusE,
  NotificationTypeE,
} from "@/types/common";

export async function POST(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const request = await req.json();
  await connectMongodb();

  if (req.method === "POST") {
    try {
      // Find the logged-in user
      const currentUser = await User.findById(session.user._id);

      // Find the user to accept the partner request from
      const targetUser = await User.findById(request?.userId);

      // Check if the target user exists
      if (!targetUser) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      // Check if the target user is not the logged-in user
      if (currentUser._id.equals(targetUser._id)) {
        return NextResponse.json(
          { message: "Cannot send partner request to yourself" },
          { status: 400 }
        );
      }

      // Check if the partner request has been sent before
      const requesterFromPartnersList = currentUser.notifications.find(
        (not: NotificationT) =>
          not.user.toString() === targetUser._id.toString() &&
          not.type === NotificationTypeE.partnerRequest // "partnerRequest"
      );

      if (!!requesterFromPartnersList) {
        // Accept partner request
        const currentUserUpdate = await User.findOneAndUpdate(
          { _id: session.user._id },
          {
            $push: {
              partners: {
                user: targetUser._id,
                status: PartnerStatusE.accepted, // "accepted",
              },
            },
            $pull: {
              notifications: { _id: requesterFromPartnersList._id },
            },
          }
        );

        const targetUserUpdate = await User.findOneAndUpdate(
          { _id: request?.userId },
          {
            $push: {
              notifications: {
                type: NotificationTypeE.partnerExcept, // "partnerExcept",
                content: `${currentUser.name} ${currentUser.surname} accepted your partner request`,
                user: session.user._id,
              },
            },
            $set: {
              "partners.$[elem].status": PartnerStatusE.accepted,
            },
          },
          {
            arrayFilters: [{ "elem.user": session.user._id }],
          }
        );

        return NextResponse.json(
          { message: `Partnership established successfully` },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "Partner request already sent or already partners" },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error("Error sending partner request:", error);
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  } else {
    NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
  }
}
