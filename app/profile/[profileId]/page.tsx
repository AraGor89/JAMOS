import Profile from "@/components/profile";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type TExactIdProfileProps = {
  searchParams: Record<string, string | string[]>;
  params: { profileId?: string };
};

const ExactIdProfile = async ({
  searchParams,
  params,
}: TExactIdProfileProps) => {
  const session = await getServerSession(authOptions);
  const redirectUrl = params?.profileId
    ? `/signin?callbackUrl=${process.env.NEXTAUTH_URL}/profile/${params?.profileId}`
    : "/signin";

  if (!session) {
    redirect(redirectUrl);
  }

  return (
    <>
      <Profile />
    </>
  );
};

export default ExactIdProfile;
