import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { RegisterFloatingButton } from "@/components/RegisterFloatingButton";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["400", "500", "600", "700"],
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
        className={`${montserrat.variable} antialiased font-sans`}
      >
        {children}
        <RegisterFloatingButton />
      </body>
    </html>
  );
}
