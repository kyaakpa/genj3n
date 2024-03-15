"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import AdminLayout from "../../admin-layout";
import PaintingsList from "../components/paintings-list";

const Page = () => {
  return (
    <AdminLayout>
      <h1>Admin Home</h1>
    </AdminLayout>
  );
};

export default Page;
