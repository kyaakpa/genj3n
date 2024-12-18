import Image from "next/image";
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
      className="relative w-full aspect-[4/5] max-w-[450px] mx-auto hover:cursor-pointer p-2"
      onMouseEnter={() => handleHover(item.id)}
      onMouseLeave={() => handleHover(null)}
      onClick={() => {
        router.push(`/shop/${item.id}`);
      }}
    >
      {item.status === "Sold" && (
        <div className="absolute top-0 left-0 bg-black text-white py-1 px-3 text-xs sm:text-sm z-20">
          SOLD
        </div>
      )}
      <div className="relative w-full aspect-square bg-blue-200">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 100vw, 
                 (max-width: 768px) 50vw,
                 33vw"
          className="object-cover"
          loading="lazy"
          quality={75}
        />
        <div
          className={`flex items-center justify-center absolute bottom-0 left-0 w-full h-[40px] sm:h-[50px] text-xs sm:text-sm bg-[#E3DED5] transition-opacity duration-500 ${
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

      <div className="flex flex-col items-center p-2 sm:p-4 gap-1 sm:gap-2 text-sm">
        <h1 className="font-semibold text-sm sm:text-base">{item.name}</h1>
        {item.status === "Sold" ? (
          <p className="text-[#c5a365] font-semibold text-xs sm:text-sm">
            Out of Stock
          </p>
        ) : (
          <p className="text-gray-600 font-semibold text-xs sm:text-sm">
            $ {item.price}
          </p>
        )}
      </div>
    </div>
  );
};

export default PaintingCard;
