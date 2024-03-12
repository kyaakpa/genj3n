import { Context } from "@/app/context/page";
import { prints } from "@/public/dummyData";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PaintingViewModal = ({ isOpen, closeModal, item }) => {
  const { handleAddToCart } = useContext(Context);
  const [isHoveredAndActive, setIsHoveredAndActive] = useState(false);

  const [productQuantity, setProductQuantity] = useState(1);
  const [orderedQuantity, setOrderedQuantity] = useState(0);

  useEffect(() => {
    if (item && item.id) {
      const cartItems = JSON.parse(localStorage.getItem("cartItems"));
      const orderedItem = cartItems
        ? cartItems.find((cartItem) => cartItem.id === item.id)
        : null;
      setOrderedQuantity(orderedItem ? orderedItem.ordered_quantity : 0);
    }
  }, [item]);

  const handleClickAddToCart = () => {
    if (orderedQuantity >= item.totalQuantity) {
      toast.error("You have reached the maximum quantity for this item.", {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        style: {
          fontSize: "14px",
          fontWeight: "500",
        },
      });
    } else {
      handleAddToCart(item, productQuantity);
      closeModal();
      setProductQuantity(1);
    }
  };

  const handleIncrement = () => {
    if (productQuantity < item.totalQuantity) {
      setProductQuantity((prevState) => prevState + 1);
    }
  };

  const handleDecrement = () => {
    if (productQuantity > 1) {
      setProductQuantity((prevState) => prevState - 1);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value > item.totalQuantity) {
      setProductQuantity(item.totalQuantity);
    } else {
      setProductQuantity(value);
    }
  };

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
              src={item.imageUrl}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col h-full w-1/2 pl-20 gap-2">
            <p className="text-2xl font-light ">{item.name}</p>
            <p className="text-xl font-light">$ {item.price}</p>

            {item.totalQuantity > 0 && (
              <>
                <p className="text-sm pt-4">Quantity</p>
                <div
                  className="flex flex-row w-20 h-10 border border-gray-400 px-4 hover:cursor-pointer transition-al duration-500 ease-in-out"
                  onMouseEnter={() => setIsHoveredAndActive(true)}
                  onMouseLeave={() => setIsHoveredAndActive(false)}
                  onClick={() => setIsHoveredAndActive(true)}
                >
                  <input
                    className="w-2/3 h-full active:outline-none focus:outline-none text-gray-400"
                    defaultValue={1}
                    min={1}
                    max={item.totalQuantity}
                    value={productQuantity}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      if (/^\d*$/.test(inputValue)) {
                        handleInputChange(e);
                      }
                    }}
                    onKeyPress={(e) => {
                      if (e.key === "-" || e.key === "e" || e.key === "E") {
                        e.preventDefault();
                      }
                    }}
                  />
                  {isHoveredAndActive && (
                    <div className="flex flex-col items-center justify-center w-1/3 h-full">
                      <p
                        className="text-xs text-gray-400"
                        onClick={handleIncrement}
                      >
                        <MdOutlineKeyboardArrowUp size={20} />
                      </p>
                      <p
                        className="text-xs text-gray-400"
                        onClick={handleDecrement}
                      >
                        <MdOutlineKeyboardArrowDown size={20} />
                      </p>
                    </div>
                  )}
                </div>
                <p className="text-xs text-red-500">
                  Only {item.totalQuantity} left in stock - order soon.{" "}
                </p>
              </>
            )}

            {item.totalQuantity <= 0 && (
              <button className="w-full font-light text-white p-4 mt-6 text-sm  bg-gray-500 opacity-50 cursor-not-allowed">
                Sold Out
              </button>
            )}
            {item.totalQuantity > 0 && (
              <button
                className="w-full font-light text-white p-4 mt-6 text-sm bg-[#c5a365] "
                onClick={handleClickAddToCart}
              >
                Add to Cart
              </button>
            )}
            <Link href={`/shop/${item.id}`}>
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
