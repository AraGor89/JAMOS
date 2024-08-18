import { FC } from "react";
import { NotificationT, NotificationTypeE } from "@/types/common";
import { Button, MenuItem, Paper, Typography } from "@mui/material";

type PropsT = {
  newNotifications: NotificationT[];
  handleExceptPartnership: (userId: string) => void;
  handleRejectPartnership: (userId: string) => void;
};

export const NotificationsList: FC<PropsT> = ({
  newNotifications,
  handleExceptPartnership,
  handleRejectPartnership,
}) => {
  return (
    <>
      <Typography component="h4" align="center">
        Notifications
      </Typography>
      {newNotifications?.map((notification) => {
        return (
          <MenuItem
            divider
            key={notification._id}
            sx={{
              ":hover": { backgroundColor: "unset" },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              component="div"
              style={{ textWrap: "wrap", wordBreak: "break-word" }}
            >
              {typeof notification.content === "string" && notification.content}
            </Typography>
            {notification.type === NotificationTypeE.partnerRequest && (
              <Typography component="span">
                <Button
                  onClick={() => handleExceptPartnership(notification.user)}
                  color="primary"
                >
                  accept
                </Button>
                <Button
                  onClick={() => handleRejectPartnership(notification.user)}
                  color="error"
                >
                  reject
                </Button>
              </Typography>
            )}
          </MenuItem>
        );
      })}
    </>
  );
};
