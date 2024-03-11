"use client";

import { useContext, useEffect, useState } from "react";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import PaintingCard from "@/components/ui/PaintingCard";
import PaintingViewModal from "@/components/ui/PaintingViewModal";
import Link from "next/link";
import { prints } from "@/public/dummyData";
import { Context } from "@/app/context/page";

const Page = () => {
  const { handleAddToCart } = useContext(Context);
  const [isHoveredAndActive, setIsHoveredAndActive] = useState(false);
  const [productInfo, setProductInfo] = useState({
    name: "",
    price: "",
    status: "",
    image: "",
    description: "",
    size: "",
    quantity: 0,
    totalQuantity: 0,
  });

  const [productQuantity, setProductQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState(null);

  const handleModal = (id) => {
    setIsModalOpen(!isModalOpen);
    setModalItem(id);
  };

  const handleIncrement = () => {
    if (productQuantity < productInfo.totalQuantity) {
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
    if (value > productInfo.totalQuantity) {
      setProductQuantity(productInfo.totalQuantity);
    } else {
      setProductQuantity(value);
    }
  };

  useEffect(() => {
    const url = window.location.href;
    console.log(url);
    let decodedText = "";
    const shopIndex = url.indexOf("/shop/");
    if (shopIndex !== -1) {
      const textAfterShop = url.substring(shopIndex + "/shop/".length);
      const decoded = decodeURIComponent(textAfterShop);
      decodedText = decoded;
    }

    if (decodedText) {
      const product = prints.find(
        (item) => item.name.replace(/ /g, "").toLowerCase() === decodedText
      );
      if (product) {
        setProductInfo(product);
      }
    }
  }, []);

  return (
    <div className="w-full px-28 h-full">
      <button className="flex items-center text-blue-500 pt-4">
        <a href="/shop" className="flex items-center text-sm">
          <IoIosArrowRoundBack size={28} className="mr-2" />
          BACK
        </a>
      </button>

      <div className="flex flex-row items-start">
        <div className="flex flex-col w-1/2 pr-4 text-left gap-4">
          <h1 className="text-4xl pt-4">{productInfo.name}</h1>
          <p className="text-2xl pt-2">$ {productInfo.price}</p>
          {productInfo.status === "Available" && (
            <div className="flex flex-col gap-2">
              <p className="text-sm pt-2">Quantity</p>
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
                  max={productInfo.totalQuantity}
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
                Only {productInfo.totalQuantity} left in stock - order soon.{" "}
              </p>
            </div>
          )}
          {productInfo.status === "Sold" && (
            <button className="w-full font-light text-white p-4 mt-6 text-sm bg-gray-500 opacity-50 cursor-not-allowed">
              Out of Stock
            </button>
          )}
          {productInfo.status === "Available" && (
            <button
              className="w-full font-light text-white p-4 mt-6 text-sm bg-[#c5a365] hover:bg-[#c9ae7c]"
              onClick={() => handleAddToCart(productInfo, productQuantity)}
            >
              Add to Cart - {productInfo.price}
            </button>
          )}
          {productInfo.status === "Available" && (
            <button className="w-full font-light text-white p-4 text-sm bg-black hover:bg-[#424141]">
              Checkout
            </button>
          )}
          <div className="flex flex-col text-sm mt-2">
            <p>{productInfo.name}</p>
            <p>{productInfo.description}</p>
            <p>Size: {productInfo.size}</p>
          </div>
        </div>
        <div className="flex flex-col w-1/2  ">
          <div className="flex w-full items-center justify-end">
            <img src={productInfo.image} alt="painting" className="" />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full mt-12">
        <div className="flex flex-row items-center justify-between w-full ">
          <h1 className="text-2xl">Related Products</h1>
          <Link
            href="/shop"
            className="flex items-center text-[#c5a365] text-sm"
          >
            <p>View All</p>
            <IoIosArrowRoundForward size={28} className="ml-2" />
          </Link>
        </div>
        <div className="flex flex-row gap-4 w-full items-center justify-between mt-8">
          {prints
            .filter((item) => item.id !== productInfo.id)
            .sort(
              (a, b) =>
                Math.abs(productInfo.id - a.id) -
                Math.abs(productInfo.id - b.id)
            )
            .slice(0, 3)
            .sort((a, b) => a.id - b.id)
            .map((item, index) => (
              <PaintingCard item={item} key={index} handleModal={handleModal} />
            ))}
        </div>
      </div>
      <PaintingViewModal
        isOpen={isModalOpen}
        closeModal={() => handleModal(null)}
        item={prints.find((item) => item.id === modalItem)}
      />
    </div>
  );
};

export default Page;
