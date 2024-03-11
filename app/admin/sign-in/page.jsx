"use client";
import React, { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import AdminLayout from "../../admin-layout";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signInWithEmailAndPassword(email, password);
      console.log(response);
      sessionStorage.setItem("user", true);
      setEmail("");
      setPassword("");
      router.push("/admin/home");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-center items-center h-screen">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center">
            <h1 className="text-4xl pb-12">Sign In</h1>

            <div className="flex flex-col w-full gap-4 pb-6 text-sm">
              <input
                type="text"
                placeholder="Email"
                className="border border-gray-400 py-2 px-4 active:outline-none focus:outline-none"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <input
                type="password"
                placeholder="Password"
                className="border border-gray-400 py-2 px-4 active:outline-none focus:outline-none"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
            <button
              className="bg-black text-white p-4 w-full active:outline-none text-sm"
              onClick={handleSubmit}
            >
              Sign In
            </button>
          </div>
          <div className="flex flex-row justify-center pt-4 text-sm gap-2">
            <p>{"Don't have an account?"}</p>
            <button
              className="text-blue-500 active:outline-none"
              onClick={() => router.push("/admin/sign-up")}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Page;
