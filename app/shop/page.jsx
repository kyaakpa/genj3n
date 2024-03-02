"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";

const Page = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredItemId, setHoveredItemId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState(null);

  const router = useRouter();

  const handleHover = (id) => {
    setIsHovered(!isHovered);
    setHoveredItemId(id);
  };

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
      staus: "Available",
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
    <div className="h-auto w-full pt-14 px-28 mb-20">
      <div className="flex flex-col items-center w-full">
        <h1 className="text-4xl pb-12 font-semibold">Shop</h1>
        <div className="grid grid-cols-3 ">
          {imageItems.map((item) => {
            return (
              <div
                key={item.id}
                className="relative h-[600px] w-[500px] m-4 hover:cursor-pointer"
                onMouseEnter={() => handleHover(item.id)}
                onMouseLeave={() => handleHover(null)}
                onClick={() => {
                  const modifiedName = encodeURIComponent(
                    item.name.replace(/\s+/g, "").toLowerCase()
                  );
                  router.push(`/shop/${modifiedName}`);
                }}
              >
                {item.price === "Sold" && (
                  <div className="absolute top-0 left-0 bg-black text-white py-1 px-4 text-sm">
                    SOLD
                  </div>
                )}
                <div className="h-[500px] w-full bg-blue-200 relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                  <div
                    className={`flex items-center justify-center absolute bottom-0 left-0 w-full  h-[50px] text-sm bg-[#E3DED5] transition-opacity duration-500 ${
                      hoveredItemId === item.id ? "opacity-80" : "opacity-0"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleModal(item.id);
                    }}
                  >
                    Quick View
                  </div>
                </div>
                <div className="flex flex-col items-center p-4 gap-2 text-sm">
                  <h1 className="font-semibold text-base">{item.name}</h1>
                  {item.status === "Sold" ? (
                    <p className="text-[#c5a365] font-semibold">Out of Stock</p>
                  ) : (
                    <p className="text-gray-600 font-semibold">{item.price}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="flex flex-col bg-white py-4 px-8 ">
            <div className="flex justify-end ">
              <button onClick={() => handleModal(null)}>
                <RxCross1 />
              </button>
            </div>
            <div className="flex flex-row w-full h-full pb-4 ">
              <div className="h-full w-1/2">
                <img
                  src={imageItems[modalItem - 1].image}
                  alt={imageItems[modalItem - 1].name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col h-full w-1/2 pl-20 gap-2">
                <p className="text-2xl font-light ">
                  {imageItems[modalItem - 1].name}
                </p>
                <p className="text-xl font-light">
                  {imageItems[modalItem - 1].price}
                </p>
                <button
                  className={`w-full font-light text-white p-4 mt-12 text-sm ${
                    imageItems[modalItem - 1].status === "Sold"
                      ? "bg-gray-500 opacity-50 cursor-not-allowed"
                      : "bg-[#c5a365]"
                  }`}
                >
                  {imageItems[modalItem - 1].status === "Sold"
                    ? "Sold Out"
                    : "Add to Cart"}
                </button>
                <Link href={`/shop/${imageItems[modalItem - 1].name}`}>
                  <p className="text-sm text-[#c5a365] underline font-light mt-2">
                    View Details
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
