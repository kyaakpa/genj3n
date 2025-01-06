import React, { useEffect, useState } from "react";

const GalleryViewModal = ({ isOpen, closeModal, item }) => {
  const [isLoading, setIsLoading] = useState(true);

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
  }, [closeModal]);

  useEffect(() => {
    setIsLoading(true);
  }, [isOpen, item]);

  if (!isOpen) return null;
  if (!item) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80">
      <div className="modal-content relative max-w-4xl w-full mx-4">
        <div className="flex justify-center items-center p-8 relative">
          {isLoading && (
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="text-white">Loading...</div>
            </div>
          )}
          <img
            src={item.imageUrl}
            alt={item.name}
            className={`max-h-[80vh] w-auto transition-opacity duration-300 ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default GalleryViewModal;