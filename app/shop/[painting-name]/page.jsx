"use client";

import { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
const Page = () => {
  const [isHoveredAndActive, setIsHoveredAndActive] = useState(false);
  const [productInfo, setProductInfo] = useState({
    name: "",
    price: "",
    status: "",
    image: "",
    description: "",
    size: "",
    quantity: 0,
  });

  const [productQuantity, setProductQuantity] = useState(1);

  const handleIncrement = () => {
    const currQuantity = productInfo.quantity;
    setProductQuantity((prevState) => {
      if (prevState < currQuantity) {
        return prevState + 1;
      }
      return prevState;
    });
  };

  const handleDecrement = () => {
    setProductQuantity((prevState) => {
      if (prevState > 1) {
        return prevState - 1;
      }
      return prevState;
    });
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value > productInfo.quantity) {
      setProductQuantity(productInfo.quantity);
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
      const product = imageItems.find(
        (item) => item.name.replace(/ /g, "").toLowerCase() === decodedText
      );
      if (product) {
        setProductInfo(product);
      }
    }
  }, []);

  const imageItems = [
    {
      id: 1,
      name: "Summer Stripes n°6 - original",
      price: "$ 100",
      status: "Available",
      image: "/test.jpg",
      description:
        "Created using acrylic paint on canvas with a palette knife and brush.",
      size: "30x40cm",
      quantity: 1,
    },
    {
      id: 2,
      name: "Painting 2",
      price: "$ 120",
      status: "Sold",
      image: "/test2.jpg",
      description:
        "Created using acrylic paint on canvas with a palette knife and brush.",
      size: "30x40cm",
      quantity: 0,
    },
    {
      id: 3,
      name: "Painting 3",
      price: "$ 100",
      status: "Available",
      image: "/test3.jpg",
      description:
        "Created using acrylic paint on canvas with a palette knife and brush.",
      size: "30x40cm",
      quantity: 2,
    },
    {
      id: 4,
      name: "Painting 4",
      price: "$ 120",
      status: "Available",
      image: "/test2.jpg",
      description:
        "Created using acrylic paint on canvas with a palette knife and brush.",
      size: "30x40cm",
      quantity: 1,
    },
    {
      id: 5,
      name: "Painting 5",
      price: "$ 100",
      status: "Available",
      image: "/test.jpg",
      description:
        "Created using acrylic paint on canvas with a palette knife and brush.",
      size: "30x40cm",
      quantity: 2,
    },
    {
      id: 6,
      name: "Painting 6",
      price: "$ 100",
      staus: "Available",
      image: "/test2.jpg",
      description:
        "Created using acrylic paint on canvas with a palette knife and brush.",
      size: "30x40cm",
      quantity: 4,
    },
    {
      id: 7,
      name: "Painting 7",
      price: "$ 120",
      status: "Sold",
      image: "/test3.jpg",
      description:
        "Created using acrylic paint on canvas with a palette knife and brush.",
      size: "30x40cm",
      quantity: 0,
    },
    {
      id: 8,
      name: "Painting 8",
      price: "$ 120",
      status: "Sold",
      image: "/test3.jpg",
      description:
        "Created using acrylic paint on canvas with a palette knife and brush.",
      size: "30x40cm",
      quantity: 0,
    },
    {
      id: 9,
      name: "Painting 9",
      price: "$ 100",
      status: "Available",
      image: "/test.jpg",
      description:
        "Created using acrylic paint on canvas with a palette knife and brush.",
      size: "30x40cm",
      quantity: 1,
    },
  ];

  console.log(productInfo);

  return (
    <div className="w-full px-28 h-full">
      <button className="flex items-center text-blue-500 pt-4">
        <a href="/shop" className="flex items-center text-sm">
          <IoIosArrowRoundBack size={28} className="mr-2" />
          BACK
        </a>
      </button>

      <div className="flex flex-row items-start mb-8">
        <div className="flex flex-col w-1/2 pr-4 text-left gap-4">
          <h1 className="text-4xl pt-4">{productInfo.name}</h1>
          <p className="text-2xl pt-2">{productInfo.price}</p>
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
                  max={productInfo.quantity}
                  value={productQuantity}
                  onChange={handleInputChange}
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
                Only {productInfo.quantity} left in stock - order soon.{" "}
              </p>
            </div>
          )}
          <button
            className={`w-full font-light text-white p-4 mt-6 text-sm ${
              productInfo.status === "Sold"
                ? "bg-gray-500 opacity-50 cursor-not-allowed"
                : "bg-[#c5a365] hover:bg-[#c9ae7c]"
            }`}
          >
            {productInfo.status === "Sold"
              ? "Out of Stock"
              : `Add to Cart -  ${productInfo.price}`}
          </button>
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
        <div className="flex flex-col w-1/2 px-4 ">
          <div className="flex w-full items-center justify-center px-4">
            <img src={productInfo.image} alt="painting" className="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
