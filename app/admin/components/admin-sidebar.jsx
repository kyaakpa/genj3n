"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/app/firebase/config";

const AdminSidebar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      sessionStorage.removeItem("user");
      router.push("/admin/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="bg-gray-800 text-white min-h-screen w-64 fixed flex flex-col">
      <div className="py-4 px-6">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>
      <nav className="flex-grow px-6">
        <ul className="flex flex-col h-full">
          <li>
            <Link
              href="/admin/home"
              className="block py-2 px-6 hover:bg-gray-700"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/admin/paintings"
              className="block py-2 px-6 hover:bg-gray-700"
            >
              Paintings
            </Link>
          </li>
          <li>
            <Link
              href="/admin/classes"
              className="block py-2 px-6 hover:bg-gray-700"
            >
              Classes
            </Link>
          </li>
          {/* Add more navigation links as needed */}
        </ul>
      </nav>
      <div className="px-6 pb-6">
        <button
          onClick={handleLogout}
          className="block py-2 px-6 w-full text-left hover:bg-gray-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
