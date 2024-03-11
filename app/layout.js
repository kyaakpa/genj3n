"use client";

import Footer from "@/components/Footer";
import "./globals.css";
import Navbar from "@/components/Navbar";
import GlobalState from "./context/page";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const isAdminPath = pathname.startsWith("/admin");

  return (
    <html lang="en">
      <body>
        <GlobalState>
          {!isAdminPath && <Navbar />}
          {children}
          {!isAdminPath && <Footer />}
        </GlobalState>
      </body>
    </html>
  );
}
