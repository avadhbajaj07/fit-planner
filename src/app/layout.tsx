import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

// Accessible viewport: zoom enabled, proper safe area cover
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#07151D",
};

export const metadata: Metadata = {
  title: "Shape Radar — Your Goals. Your Body. Your Plan.",
  description:
    "Personalized workout and nutrition planning for adults 18+. Modern athlete operating system with automated progressive overload.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Shape Radar",
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
    <html lang="en" className={`dark ${dmSans.variable} h-full`}>
      <body className="min-h-[100dvh] flex flex-col font-sans antialiased selection:bg-[#673DE6] selection:text-white">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
