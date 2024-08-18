"use client";

import { FC, createContext, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

import { UserT } from "@/types/common";
import { fetchUserProfile } from "@/libs/axiosApi/getUserProfile";

type UserContextProps = {
  userProfile: UserT;
  isUserProfileLoading: boolean;
} | null;

export const UserContext = createContext<UserContextProps>(null);

type ContextProviderProps = {
  children: ReactNode;
};

export const UserContextProvider: FC<ContextProviderProps> = ({ children }) => {
  const session = useSession();

  const {
    data: userProfile,
    error,
    isError,
    isLoading: isUserProfileLoading,
    isSuccess,
  } = useQuery<UserT, Error>({
    queryKey: ["userProfile", session?.data?.user?._id],
    queryFn: async () =>
      await fetchUserProfile(session?.data?.user?._id as string),
    enabled: !!session?.data?.user?._id && session.status === "authenticated",
    refetchOnWindowFocus: true,
    // staleTime: 0,
  });

  // if (isUserProfileLoading) {
  //   return <p>Loading...</p>;
  // }

  return (
    <UserContext.Provider
      value={{ userProfile: userProfile as UserT, isUserProfileLoading }}
    >
      {children}
    </UserContext.Provider>
  );
};
