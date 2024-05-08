import React, { useEffect } from "react";

import "react-toastify/dist/ReactToastify.css";

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
          <img
            src={item.imageUrl}
            alt={item.name}
            className="max-h-[80vh] max-w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default GalleryViewModal;
