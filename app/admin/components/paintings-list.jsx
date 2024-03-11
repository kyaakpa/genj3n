"use client";

import PaintingViewModal from "@/components/ui/PaintingViewModal";
import { prints } from "@/public/dummyData";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import AdminPaintingCard from "./AdminPaintingCard";

const PaintingsList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState(null);

  const handleModal = (id) => {
    setIsModalOpen(!isModalOpen);
    setModalItem(id);
  };

  return (
    <div className="h-auto w-full pt-6">
      <div className="flex flex-col items-start w-full">
        <div className="flex justify-between w-full px-8 pb-12 ">
          <h1 className="text-2xl font-semibold">Available Paintings</h1>

          <div className="flex items-center gap-2 cursor-pointer bg-blue-600 text-white p-2 px-4 rounded-md">
            <FaPlus />
            <button className="active:outline-none text-sm">
              Add New Painting
            </button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-y-4 gap-x-12 px-8 ">
          {prints.map((item) => (
            <AdminPaintingCard
              item={item}
              key={item.id}
              handleModal={handleModal}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaintingsList;
