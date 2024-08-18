"use client";
import { Roboto, Montserrat } from "next/font/google";
import { createTheme } from "@mui/material/styles";
import { purple, green } from "@mui/material/colors";

const monserat = Montserrat({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  palette: {
    primary: {
      main: "#FA3F66", // Set your desired primary color here
    },
    secondary: {
      main: green[500], // Optionally, set a secondary color
    },
  },
  typography: {
    fontFamily: monserat.style.fontFamily,
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "12px", // Set your desired border radius here
        },
        notchedOutline: {
          borderRadius: "12px", // Set the same border radius here
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px", // Set your desired border radius here
        },
      },
    },
  },
});
// FA3F66

export default theme;
