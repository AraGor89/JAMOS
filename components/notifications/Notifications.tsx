"use client";

import { FC } from "react";
import { Badge, Menu } from "@mui/material";
// import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";

import { NotificationsList } from "./NotificationsList";
import { NotificationComponentType } from "@/types/common";
import { useNotifications } from "@/hooks/useNotifications";

type PropsT = {
  type: NotificationComponentType;
};

export const Notifications: FC<PropsT> = ({ type }) => {
  const {
    open,
    anchorEl,
    sortedNotifications,
    newNotifications,
    newNotificationsLength,
    handleClose,
    handleClick,
    handleExceptPartnership,
    handleRejectPartnership,
  } = useNotifications();
  const isTypeMenu = type === NotificationComponentType.menu;

  return (
    <>
      {isTypeMenu ? (
        <>
          <Badge
            max={999}
            color="secondary"
            onClick={handleClick}
            badgeContent={newNotificationsLength}
            style={{
              cursor: newNotificationsLength ? "pointer" : "unset",
              pointerEvents: newNotificationsLength ? "unset" : "none",
            }}
          >
            <NotificationsRoundedIcon />
          </Badge>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <NotificationsList
              newNotifications={newNotifications}
              handleExceptPartnership={handleExceptPartnership}
              handleRejectPartnership={handleRejectPartnership}
            />
          </Menu>
        </>
      ) : (
        <NotificationsList
          newNotifications={sortedNotifications}
          handleExceptPartnership={handleExceptPartnership}
          handleRejectPartnership={handleRejectPartnership}
        />
      )}
    </>
  );
};
