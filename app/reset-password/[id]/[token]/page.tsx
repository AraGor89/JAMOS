import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import ResetPass from "@/components/resetPass/ResetPass";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const ResetPassword = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return (
    <>
      <ResetPass />
    </>
  );
};

export default ResetPassword;
