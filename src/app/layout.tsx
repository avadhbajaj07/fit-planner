import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#07151D",
};

export const metadata: Metadata = {
  title: "FIT Planner — Your Goals. Your Body. Your Plan.",
  description:
    "Personalized workout and nutrition planning for adults 18+. Built for athlete focus with real-time plan generation and iOS native feel.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FIT Planner",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark bg-[#07151D] text-[#F4F9FA] h-full">
      <body className="min-h-[100dvh] flex flex-col bg-[#07151D] text-[#F4F9FA] antialiased selection:bg-[#28DACC] selection:text-[#07151D]">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
