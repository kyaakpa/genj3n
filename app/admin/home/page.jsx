"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import AdminLayout from "../../admin-layout";
import PaintingsList from "../components/paintings-list";

const Page = () => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  if (!loading && !user) {
    router.push("/admin/sign-in");
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AdminLayout>
      <h1>Admin Home</h1>
      <h2>{user?.email}</h2>
    </AdminLayout>
  );
};

export default Page;
