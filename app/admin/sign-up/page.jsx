"use client";
import React, { useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import AdminLayout from "../../admin-layout";
import { useRouter } from "next/navigation";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createUserWithEmailAndPassword(email, password);
      console.log(response);
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-center items-center h-screen">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center">
            <h1 className="text-4xl pb-12">Sign Up</h1>

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
              Sign Up
            </button>
          </div>
          <div className="flex flex-row justify-center pt-4 text-sm gap-2">
            <p>{"Already have an account?"}</p>
            <button
              className="text-blue-500 active:outline-none"
              onClick={() => router.push("/admin/sign-in")}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Page;
