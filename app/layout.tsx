import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/header/Header";
import AuthProvider from "@/providers/AuthProvider";
import TanstackProvider from "@/providers/TanstackProvider";
import { UserContextProvider } from "@/providers/ContextProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";

import "./globals.css";
import theme from "./../theme";
// import Footer from "@/components/footer/Footer";
import { ThemeProvider } from "@mui/material/styles";
import { ToastProvider } from "@/providers/tosterProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  // TODO:
  metadataBase: new URL("http://localhost:3000"),
  title: "JAMOS",
  description:
    "JAMOS is an app that helps you communicate your feelings, thoughts, and emotions with loved ones using a touch of humor.",
  keywords: [
    "JAMOS, settings, feedback to partner, communication, feelings, emotions, healthy relationships, humor, characteristics, partnership",
  ],
  twitter: {
    card: "summary_large_image",
    // site: "https://www.example.com",
    title: "JAMOS - Just A Matter Of Settings",
    description:
      "JAMOS is an app that helps you communicate your feelings, thoughts, and emotions with loved ones using a touch of humor.",
    images: "/logoPink.svg",
    creator: "@arakelyangor",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "JAMOS - Just A Matter Of Settings",
    description:
      "JAMOS is an app that helps you communicate your feelings, thoughts, and emotions with loved ones using a touch of humor.",
    images: "/logoPink.svg",
    siteName: "JAMOS",
    locale: "en_US",
  },
};

type RootLayoutT = {
  children: React.ReactNode;
};

const layoutStyles: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
};

const mainStyles: React.CSSProperties = {
  flexGrow: 1,
  minHeight: `calc(100vh - 90px)`,
  // padding: "10px 20px",
};

export default function RootLayout({ children }: RootLayoutT) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <AuthProvider>
              <TanstackProvider>
                <UserContextProvider>
                  <ToastProvider>
                    <div style={layoutStyles}>
                      <Header />
                      <main style={mainStyles}>{children}</main>
                      {/* <Footer /> */}
                    </div>
                  </ToastProvider>
                </UserContextProvider>
              </TanstackProvider>
            </AuthProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
