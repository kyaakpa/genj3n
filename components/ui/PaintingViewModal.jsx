import Link from "next/link";
import React, { useEffect } from "react";
import { RxCross1 } from "react-icons/rx";

const PaintingViewModal = ({ isOpen, closeModal, item }) => {
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

  let modifiedName = encodeURIComponent(
    item.name.replace(/\s+/g, "").toLowerCase()
  );

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="flex flex-col bg-white py-4 px-8 modal-content">
        <div className="flex justify-end ">
          <button onClick={closeModal}>
            <RxCross1 />
          </button>
        </div>
        <div className="flex flex-row w-full h-full pb-4 ">
          <div className="h-full w-1/2">
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col h-full w-1/2 pl-20 gap-2">
            <p className="text-2xl font-light ">{item.name}</p>
            <p className="text-xl font-light">{item.price}</p>
            <button
              className={`w-full font-light text-white p-4 mt-12 text-sm ${
                item.status === "Sold"
                  ? "bg-gray-500 opacity-50 cursor-not-allowed"
                  : "bg-[#c5a365]"
              }`}
            >
              {item.status === "Sold" ? "Sold Out" : "Add to Cart"}
            </button>
            <Link href={`/shop/${modifiedName}`}>
              <p className="text-sm text-[#c5a365] underline font-light mt-2">
                View Details
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaintingViewModal;
