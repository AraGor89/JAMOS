"use client";

import { useState } from "react";
import { useUserContext } from "./useUserContext";
import { NotificationTypeE } from "@/types/common";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptPartnerRequest } from "@/libs/axiosApi/acceptPartnerRequest";
import { rejectPartnerRequest } from "@/libs/axiosApi/rejectPartnerRequest";

export const useNotifications = () => {
  const profileData = useUserContext();
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  // const { profileId } = useParams();

  const { notifications, _id, partners } = profileData.userProfile || {};

  const { mutate: acceptPartnerMutation } = useMutation({
    mutationFn: (userId: string) => acceptPartnerRequest(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userProfile", _id],
      });
    },
  });

  const { mutate: rejectPartnerMutation } = useMutation({
    mutationFn: (userId: string) => rejectPartnerRequest(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userProfile", _id],
      });
    },
  });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    localStorage.setItem("LAST_SEEN_NOTIFICATION_DATE", new Date() + "");
  };

  const getNewNotifications = () => {
    let lastSeenDate;
    if (typeof window !== "undefined") {
      lastSeenDate = localStorage.getItem("LAST_SEEN_NOTIFICATION_DATE");
    }

    if (!lastSeenDate) return notifications;

    if (!!notifications) {
      const newNotifications = notifications.filter((notification) => {
        return (
          new Date(notification.createdAt) > new Date(lastSeenDate) ||
          (notification.type === NotificationTypeE.partnerRequest &&
            !partners.length)
        );
      });

      return newNotifications;
    }
    return [];
  };
  const newNotifications = getNewNotifications()?.toSorted(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const newNotificationsLength = newNotifications?.length;
  const sortedNotifications = notifications?.toSorted(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleExceptPartnership = async (userId: string) => {
    try {
      acceptPartnerMutation(userId);
      handleClose();
    } catch (error) {}
  };

  const handleRejectPartnership = async (userId: string) => {
    try {
      rejectPartnerMutation(userId);
      handleClose();
    } catch (error) {}
  };

  return {
    open,
    anchorEl,
    newNotifications,
    sortedNotifications,
    newNotificationsLength,
    handleClose,
    handleClick,
    handleExceptPartnership,
    handleRejectPartnership,
  };
};
