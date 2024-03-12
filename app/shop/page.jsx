"use client";

import PaintingCard from "@/components/ui/PaintingCard";
import PaintingViewModal from "@/components/ui/PaintingViewModal";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";

const Page = () => {
  const [paintings, setPaintings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState(null);

  const handleModal = (id) => {
    setIsModalOpen(!isModalOpen);
    setModalItem(id);
  };

  const getPaintings = async () => {
    const querySnapshot = await getDocs(collection(db, "paintings"));
    const paintings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    paintings.reverse();
    setPaintings(paintings);
  };

  useEffect(() => {
    getPaintings();
  }, []);

  return (
    <div className="h-auto w-full pt-14 px-28">
      <div className="flex flex-col items-center w-full">
        <h1 className="text-4xl pb-12 font-semibold">Shop</h1>
        <div className="grid grid-cols-3 gap-y-4 gap-x-12">
          {paintings.map((item) => (
            <PaintingCard item={item} key={item.id} handleModal={handleModal} />
          ))}
        </div>
      </div>
      <PaintingViewModal
        isOpen={isModalOpen}
        closeModal={() => handleModal(null)}
        item={paintings.find((item) => item.id === modalItem)}
      />
    </div>
  );
};

export default Page;
