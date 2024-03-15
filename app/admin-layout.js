"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "./admin/components/admin-sidebar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/config";
import { ToastContainer } from "react-toastify";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const isLoginOrSignUpPage =
    pathname === "/admin/sign-in" || pathname === "/admin/sign-up";

  if (!user && !loading && !isLoginOrSignUpPage) {
    router.push("/admin/sign-in");
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <html lang="en">
      <body className="flex">
        {!isLoginOrSignUpPage && <AdminSidebar />}
        <main className={`${isLoginOrSignUpPage ? "" : "ml-64"} flex-1 p-6`}>
          {children}
          <ToastContainer />
        </main>
      </body>
    </html>
  );
}
