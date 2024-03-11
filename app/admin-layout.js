"use client";
import React from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./admin/components/admin-sidebar";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const isLoginOrSignUpPage =
    pathname === "/admin/sign-in" || pathname === "/admin/sign-up";

  return (
    <html lang="en">
      <body className="flex">
        {!isLoginOrSignUpPage && <AdminSidebar />}
        <main className={`${isLoginOrSignUpPage ? "" : "ml-64"} flex-1 p-6`}>
          {children}
        </main>
      </body>
    </html>
  );
}
