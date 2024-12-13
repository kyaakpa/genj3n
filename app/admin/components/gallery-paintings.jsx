"use client";

import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import AdminGalleryPaintingCard from "./AdminGalleryPaintingCard";

const GalleryPaintings = () => {
  const [paintings, setPaintings] = useState([]);
  const router = useRouter();

  const getPaintings = async () => {
    const querySnapshot = await getDocs(collection(db, "gallery"));
    const paintings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPaintings(paintings);
  };

  useEffect(() => {
    getPaintings();
  }, []);

  return (
    <div className="h-auto w-full pt-6">
      <div className="flex flex-col items-start w-full">
        <div className="flex justify-between w-full px-8 pb-12 ">
          <h1 className="text-2xl font-semibold">Available Paintings</h1>

          <div
            className="flex items-center gap-2 cursor-pointer bg-black text-white py-4 px-4 hover:cursor-pointer"
            onClick={() => router.push("/admin/gallery/new")}
          >
            <FaPlus />
            <button className="active:outline-none text-sm">
              Add New Painting
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-y-4 gap-x-12 px-8 ">
          {paintings.map((item) => (
            <AdminGalleryPaintingCard item={item} key={item.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryPaintings;
