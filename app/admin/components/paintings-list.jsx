"use client";

import { prints } from "@/public/dummyData";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import AdminPaintingCard from "./AdminPaintingCard";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase/config";

const PaintingsList = () => {
  const [paintings, setPaintings] = useState([]);
  const router = useRouter();

  const getPaintings = async () => {
    const querySnapshot = await getDocs(collection(db, "paintings"));
    const paintings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPaintings(paintings);

    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  };

  useEffect(() => {
    getPaintings();
  }, []);

  return (
    <div className="h-auto w-full pt-6">
      <div className="flex flex-col items-start w-full">
        <div className="flex justify-between w-full px-8 pb-12 ">
          <h1 className="text-2xl font-semibold">Available Paintings</h1>

          <div className="flex items-center gap-2 cursor-pointer bg-blue-600 text-white p-2 px-4 rounded-md hover:opacity-80 transition-all duration-300 ease-in-out">
            <FaPlus />
            <button
              className="active:outline-none text-sm"
              onClick={() => router.push("/admin/paintings/new")}
            >
              Add New Painting
            </button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-y-4 gap-x-12 px-8 ">
          {paintings.map((item) => (
            <AdminPaintingCard item={item} key={item.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaintingsList;
