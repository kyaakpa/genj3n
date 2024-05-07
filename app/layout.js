// RootLayout.jsx
"use client";
import Footer from "@/components/Footer";
import "./globals.css";
import GlobalState from "./context/page";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ToastContainer } from "react-toastify";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith("/admin");

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <GlobalState>
          {!isAdminPath && <Navbar />}
          <main className="flex-grow">{children}</main>
          {!isAdminPath && <Footer />}
          <ToastContainer />
        </GlobalState>
      </body>
    </html>
  );
}
