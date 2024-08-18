import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { NotificationComponentType } from "@/types/common";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { Notifications } from "@/components/notifications/Notifications";

const NotificationsPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <>
      <Notifications type={NotificationComponentType.page} />
    </>
  );
};

export default NotificationsPage;
