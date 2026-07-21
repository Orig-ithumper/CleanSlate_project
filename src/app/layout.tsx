import type { ReactNode } from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/Header";   // ✅ Import your Header component

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CleanSlate",
  description: "Expungement Assistance App",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: { children: ReactNode }) {

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <Header />         {/* ✅ Display Header at the top */}
        <main>{children}</main>
      </body>
    </html>
  );
}
