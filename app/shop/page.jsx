"use client";

import PaintingCard from "@/components/ui/PaintingCard";
import PaintingViewModal from "@/components/ui/PaintingViewModal";
import { prints } from "@/public/dummyData";
import React, { useState } from "react";

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState(null);

  const handleModal = (id) => {
    setIsModalOpen(!isModalOpen);
    setModalItem(id);
  };

  return (
    <div className="h-auto w-full pt-14 px-28">
      <div className="flex flex-col items-center w-full">
        <h1 className="text-4xl pb-12 font-semibold">Shop</h1>
        <div className="grid grid-cols-3 gap-y-4 gap-x-12">
          {prints.map((item) => (
            <PaintingCard item={item} key={item.id} handleModal={handleModal} />
          ))}
        </div>
      </div>
      <PaintingViewModal
        isOpen={isModalOpen}
        closeModal={() => handleModal(null)}
        item={prints.find((item) => item.id === modalItem)}
      />
    </div>
  );
};

export default Page;
