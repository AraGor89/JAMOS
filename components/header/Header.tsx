"use client";

import { FC, MouseEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { signOut, useSession } from "next-auth/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  Box,
  List,
  AppBar,
  Drawer,
  Divider,
  Toolbar,
  Tooltip,
  ListItem,
  IconButton,
  Typography,
  CssBaseline,
  ListItemButton,
} from "@mui/material";
import {
  VpnKeyRounded as LoginIcon,
  PersonRounded as MyProfileIcon,
  PeopleAltRounded as PartnerProfileIcon,
  OtherHousesRounded as HomeIcon,
  LockRounded as LogoutIcon,
} from "@mui/icons-material";

import { useUserContext } from "@/hooks/useUserContext";
import { useNotifications } from "@/hooks/useNotifications";
import { Notifications } from "../notifications/Notifications";
import {
  PathT,
  PartnerT,
  PartnerStatusE,
  NotificationComponentType,
} from "@/types/common";

type PropsT = {};

const Header: FC<PropsT> = () => {
  const theme = useTheme();
  const router = useRouter();
  const pathName = usePathname();
  const { data } = useSession();
  const { profileId } = useParams();
  const profileData = useUserContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { newNotificationsLength } = useNotifications();

  const { _id, partners } = profileData.userProfile || {};

  const partner =
    partners &&
    partners?.find((item: PartnerT) => item.status === PartnerStatusE.accepted);

  const isAuth = !!data?.user;

  const isHomePage = pathName === "/";
  const isSigninPage = pathName === "/signin";
  const isNotificationsPage = pathName === "/notifications";
  const isMyPage = Boolean(profileId) && profileId === _id;
  const isPartnersPage = Boolean(profileId) && profileId === partner?.user;

  const publicPaths: PathT[] = [
    {
      name: "Sign In",
      path: "/signin",
      type: "link",
      isSelected: isSigninPage,
      icon: <LoginIcon />,
    },
    {
      name: "Home",
      path: "/",
      type: "link",
      isSelected: isHomePage,
      icon: <HomeIcon />,
    },
  ];

  const protectedPaths: PathT[] = [
    {
      name: `Notifications${
        newNotificationsLength ? `(${newNotificationsLength})` : ""
      }`,
      path: "/notifications",
      type: "link",
      isSelected: isNotificationsPage,
      icon: <Notifications type={NotificationComponentType.menu} />,
      // component: <Notifications type={NotificationComponentType.menu} />,
    },
    {
      name: "Home",
      path: "/",
      type: "link",
      isSelected: isHomePage,
      icon: <HomeIcon />,
    },
    {
      name: "Logout",
      path: "/signin",
      type: "button",
      isSelected: false,
      icon: <LogoutIcon />,
    },
    {
      name: "My Profile",
      path: `/profile/${_id}`,
      type: "link",
      isSelected: isMyPage,
      icon: <MyProfileIcon />,
    },
    {
      type: "link",
      name: "Partner Profile",
      path: partner?.user ? `/profile/${partner.user}` : "",
      isSelected: isPartnersPage,
      icon: <PartnerProfileIcon />,
    },
  ];

  const navItems = isAuth ? protectedPaths : publicPaths;

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleLinkClick = (
    // e: MouseEvent<HTMLAnchorElement>,
    e: MouseEvent<HTMLButtonElement>,
    item: PathT,
    isNotificationItem?: Boolean
  ) => {
    e.preventDefault();
    // NOTE: for big screen notifications are presented as a modal menu
    if (isNotificationItem) return;
    console.log("isNotificationItem", isNotificationItem);

    if (item.type === "link") {
      if (item.name.includes("Notifications")) {
        localStorage.setItem("LAST_SEEN_NOTIFICATION_DATE", new Date() + "");
      }
      router.push(item.path);
    }

    if (item.type === "button") {
      signOut({ callbackUrl: "/signin" });
    }
  };

  const RenderNavigation = ({ isMobileView }: { isMobileView?: boolean }) => {
    return (
      <>
        {navItems.map((item, i) => {
          const isNotificationItem =
            item.name.includes("Notifications") && !isMobileView;
          return (
            <Tooltip title={item.name} key={item.path}>
              <IconButton
                role="figure"
                size="small"
                edge="start"
                color="inherit"
                disableRipple
                onClick={(e) => handleLinkClick(e, item, isNotificationItem)}
                sx={{
                  backgroundColor: "transparent",
                  "&:hover": {
                    color: "black", // Change icon color on hover
                    backgroundColor: "transparent", // Remove background on hover
                    transform: "scale(1.1)", // Slightly scale up the icon
                  },
                  color: item.isSelected ? "black" : "unset",
                  gap: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyItems: "center",
                }}
              >
                <Typography component="span" sx={{ cursor: "pointer" }}>
                  {item.icon}{" "}
                </Typography>
                {isMobileView && (
                  <Link
                    // onClick={(e) =>
                    //   handleLinkClick(e, item, isNotificationItem)
                    // }
                    key={item.path}
                    href={item.path}
                    style={{
                      fontWeight: item.isSelected ? "bold" : "unset",
                    }}
                  >
                    {isNotificationItem ? item.component : item.name}
                  </Link>
                )}
              </IconButton>
            </Tooltip>
          );
        })}
      </>
    );
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography
        sx={{
          display: "flex",
          padding: "10px 0",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          src="/logoPink.svg"
          alt="Logo"
          width={0}
          height={0}
          style={{ width: "80%", height: "auto", cursor: "pointer" }}
          priority
          onClick={() => router.push("/")}
        />
      </Typography>
      <Divider />
      <List
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "baseline",
        }}
      >
        <RenderNavigation isMobileView />
      </List>
    </Box>
  );

  const MainLogo = (
    <Image
      src="/logoWhite.svg"
      alt="Logo"
      width={0}
      height={0}
      style={{ width: "150px", height: "100px", cursor: "pointer" }}
      priority
      onClick={() => router.push("/")}
    />
  );

  return (
    <Box sx={{ display: "flex", height: "90px" }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar sx={{ height: "90px" }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <Menu />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            {MainLogo}
          </Typography>

          <Box sx={{ display: { xs: "none", sm: "flex", gap: "20px" } }}>
            <RenderNavigation />
          </Box>

          <Box
            width="100%"
            justifyContent="end"
            sx={{ display: { xs: "flex", sm: "none", md: "none", lg: "none" } }}
          >
            {MainLogo}
          </Box>
        </Toolbar>
      </AppBar>

      <Typography component="nav">
        <Drawer
          // container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 200, // 170,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Typography>
    </Box>
  );
};

export default Header;
