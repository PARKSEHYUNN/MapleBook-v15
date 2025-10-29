import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

config.autoAddCss = false;

const pretendardFont = localFont({
  src: [
    {
      path: "./fonts/PretendardVariable.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "MapleBook",
  description: "MapleBook",
  icons: {
    icon: "/logo.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="ko">
        <body className={`${pretendardFont.variable} antialiased`}>
          <Navbar />
          <div className="flex justify-center">
            <div className="w-[100vw] text-center md:w-[80vw]">{children}</div>
          </div>
        </body>
      </html>
    </SessionProvider>
  );
}
