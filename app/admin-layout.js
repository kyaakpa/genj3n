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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-gray-500">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="flex">
        {!isLoginOrSignUpPage && <AdminSidebar />}
        <main className={`${isLoginOrSignUpPage ? "w-full" : "ml-64"} flex-1`}>
          {children}
          <ToastContainer />
        </main>
      </div>
    </div>
  );
}