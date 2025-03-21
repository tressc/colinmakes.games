import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/contexts/userContext";
import { LanguageProvider } from "@/contexts/languageContext";
import { Suspense } from "react";
import Navbar from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "colinmakes.games",
  description: "real-time multiplayer board games",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-screen bg-[#292929] bg-[url(/img/paper.jpg)] bg-cover antialiased bg-blend-multiply`}
      >
        <Suspense fallback={null}>
          <LanguageProvider>
            <UserProvider>
              <Navbar />
              {children}
            </UserProvider>
          </LanguageProvider>
        </Suspense>
      </body>
    </html>
  );
}
