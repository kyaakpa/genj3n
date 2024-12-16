import Image from "next/image";
import React, { useEffect } from "react";

const GalleryViewModal = ({ isOpen, closeModal, item }) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".modal-content")) {
        closeModal();
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, closeModal]);

  if (!isOpen) return null;
  if (!item) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80">
      <div>
        <div className="flex justify-center items-center p-8">
          <Image
            src={item.imageUrl}
            alt={item.name}
            width={300}
            height={300}
            loading="lazy"
            quality={80}
            className="max-h-[80vh] max-w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default GalleryViewModal;
