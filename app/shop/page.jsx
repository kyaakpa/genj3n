"use client";

import React, { useState } from "react";

const Page = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredItemId, setHoveredItemId] = useState(null);

  const handleHover = (id) => {
    setIsHovered(!isHovered);
    setHoveredItemId(id);
  };

  const imageItems = [
    {
      id: 1,
      name: "Painting 1",
      price: "$100",
      image: "/test.jpg",
    },
    {
      id: 2,
      name: "Painting 2",
      price: "Sold",
      image: "/test2.jpg",
    },
    {
      id: 3,
      name: "Painting 3",
      price: "$100",
      image: "/test3.jpg",
    },
    {
      id: 4,
      name: "Painting 4",
      price: "Sold",
      image: "/test2.jpg",
    },
    {
      id: 5,
      name: "Painting 5",
      price: "$100",
      image: "/test.jpg",
    },
    {
      id: 6,
      name: "Painting 6",
      price: "$100",
      image: "/test2.jpg",
    },
    {
      id: 7,
      name: "Painting 7",
      price: "Sold",
      image: "/test3.jpg",
    },
    {
      id: 8,
      name: "Painting 8",
      price: "Sold",
      image: "/test3.jpg",
    },
    {
      id: 9,
      name: "Painting 9",
      price: "$100",
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
                  >
                    Quick View
                  </div>
                </div>
                <div className="flex flex-col items-center p-4 gap-2 text-sm">
                  <h1 className="font-semibold text-base">{item.name}</h1>
                  {item.price === "Sold" ? (
                    <p className="text-[#c5a365] font-semibold">Sold Out</p>
                  ) : (
                    <p className="text-gray-600 font-semibold">{item.price}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Page;
