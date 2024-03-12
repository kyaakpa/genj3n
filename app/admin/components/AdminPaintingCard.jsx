import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaRegEdit } from "react-icons/fa";

const AdminPaintingCard = ({ item }) => {
  console.log("Item:", item);
  const [isHovered, setIsHovered] = useState(false);

  const router = useRouter();

  const handleHover = () => {
    setIsHovered(!isHovered);
  };

  const handleEditClick = () => {
    router.push(`/admin/paintings/${item.id}`);
  };

  return (
    <div
      key={item.id}
      className="relative h-[350px] w-[350px]  hover:cursor-pointer"
      onMouseEnter={() => handleHover(item.id)}
      onMouseLeave={() => handleHover(null)}
      onClick={handleEditClick}
    >
      <div
        className={`absolute top-0 right-0 py-2 px-4 z-20 text-sm bg-red-600 text-white transition-opacity duration-200 ${
          isHovered ? "opacity-80" : "opacity-0"
        }`}
      >
        Edit
      </div>
      <div className="h-[250px] w-full bg-blue-200 relative">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex py-4 text-sm font-semibold bg-gray-100 p-4">
        <div className="inline-flex flex-col items-start">
          <h1>Name:</h1>
          <p>Price:</p>
          <h1>Quantity:</h1>
        </div>
        <div className="inline-flex flex-col items-start ml-4">
          <span>{item.name}</span>
          <span>$ {item.price}</span>
          <span>{item.totalQuantity}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminPaintingCard;
