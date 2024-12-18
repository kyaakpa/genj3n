import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const GalleryCard = ({ item, handleModal }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleHover = () => {
    setIsHovered(!isHovered);
  };

  return (
    <div
      key={item.id}
      className="relative w-full aspect-[5/6] sm:max-w-[400px] md:max-w-[500px] hover:cursor-pointer"
      onMouseEnter={() => handleHover(item.id)}
      onMouseLeave={() => handleHover(null)}
      onClick={(e) => {
        e.stopPropagation();
        handleModal(item.id);
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
          quality={80}
          priority={false}
          className="object-cover"
        />
        <div
          className={`flex items-center justify-center absolute bottom-0 left-0 w-full h-[40px] sm:h-[50px] text-xs sm:text-sm bg-[#E3DED5] transition-opacity duration-500 ${
            isHovered ? "opacity-80" : "opacity-0"
          }`}
        >
          Quick View
        </div>
      </div>

      <div className="flex flex-col items-center p-2 sm:p-4 gap-1 sm:gap-2">
        <h1 className="font-semibold text-sm sm:text-base">{item.name}</h1>
      </div>
    </div>
  );
};

export default GalleryCard;
