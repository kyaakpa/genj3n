"use client";

import PaintingCard from "@/components/ui/PaintingCard";
import PaintingViewModal from "@/components/ui/PaintingViewModal";
import React, { useState } from "react";

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState(null);

  const handleModal = (id) => {
    setIsModalOpen(!isModalOpen);
    setModalItem(id);
  };

  const imageItems = [
    {
      id: 1,
      name: "Summer Stripes n°6 - original",
      price: "$ 100",
      status: "Available",
      image: "/test.jpg",
    },
    {
      id: 2,
      name: "Painting 2",
      price: "$ 120",
      status: "Sold",
      image: "/test2.jpg",
    },
    {
      id: 3,
      name: "Painting 3",
      price: "$ 100",
      status: "Available",
      image: "/test3.jpg",
    },
    {
      id: 4,
      name: "Painting 4",
      price: "$ 120",
      status: "Available",
      image: "/test2.jpg",
    },
    {
      id: 5,
      name: "Painting 5",
      price: "$ 100",
      status: "Available",
      image: "/test.jpg",
    },
    {
      id: 6,
      name: "Painting 6",
      price: "$ 100",
      status: "Available",
      image: "/test2.jpg",
    },
    {
      id: 7,
      name: "Painting 7",
      price: "$ 120",
      status: "Sold",
      image: "/test3.jpg",
    },
    {
      id: 8,
      name: "Painting 8",
      price: "$ 120",
      status: "Sold",
      image: "/test3.jpg",
    },
    {
      id: 9,
      name: "Painting 9",
      price: "$ 100",
      status: "Available",
      image: "/test.jpg",
    },
  ];

  return (
    <div className="h-auto w-full pt-14 px-28">
      <div className="flex flex-col items-center w-full">
        <h1 className="text-4xl pb-12 font-semibold">Shop</h1>
        <div className="grid grid-cols-3 gap-y-4 gap-x-12">
          {imageItems.map((item) => (
            <PaintingCard item={item} key={item.id} handleModal={handleModal} />
          ))}
        </div>
      </div>
      <PaintingViewModal
        isOpen={isModalOpen}
        closeModal={() => handleModal(null)}
        item={imageItems.find((item) => item.id === modalItem)}
      />
    </div>
  );
};

export default Page;
