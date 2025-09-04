import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RegisterFloatingButton } from "@/components/RegisterFloatingButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Synergy SEA Summit 2025 - Where Innovation Meets Culture in Bali",
  description: "Join Southeast Asia's premier tech and innovation summit in Bali. Connect with industry leaders, discover cutting-edge technologies, and celebrate the fusion of innovation and culture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <RegisterFloatingButton />
      </body>
    </html>
  );
}
