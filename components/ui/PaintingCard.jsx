import { useRouter } from "next/navigation";
import React, { useState } from "react";

const PaintingCard = ({ item, handleModal }) => {
  const [isHovered, setIsHovered] = useState(false);

  const router = useRouter();

  const handleHover = () => {
    setIsHovered(!isHovered);
  };

  return (
    <div
      key={item.id}
      className="relative h-[600px] w-[500px]  hover:cursor-pointer"
      onMouseEnter={() => handleHover(item.id)}
      onMouseLeave={() => handleHover(null)}
      onClick={() => {
        const modifiedName = encodeURIComponent(
          item.name.replace(/\s+/g, "").toLowerCase()
        );
        router.push(`/shop/${modifiedName}`);
      }}
    >
      {item.status === "Sold" && (
        <div className="absolute top-0 left-0 bg-black text-white py-1 px-4 text-sm z-20">
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
            isHovered ? "opacity-80" : "opacity-0"
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
};

export default PaintingCard;
