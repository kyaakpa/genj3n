"use client";

import React, { useContext, useState, useEffect } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import { Context } from "../context/page";
import { useRouter } from "next/navigation";

const Page = () => {
  const { cartItems, setOrderNote } = useContext(Context);
  const {
    handleAddToCart,
    handleRemoveFromCart,
    handleDeleteFromCart,
    handleInputChange,
  } = useContext(Context);

  const [errorText, setErrorText] = useState("");
  const [errorTextIndex, setErrorTextIndex] = useState(0);
  const [note, setNote] = useState("");
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();

  // Add this useEffect to handle client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleIncrement = (index) => {
    const totalQuantity = cartItems[index].totalQuantity;
    console.log("Current ordered quantity:", cartItems[index].ordered_quantity);
    console.log("Total quantity available:", totalQuantity);

    if (cartItems[index].ordered_quantity < totalQuantity) {
      console.log("Adding to cart...");
      handleAddToCart(cartItems[index]);
    } else {
      setErrorText("Maximum quantity reached");
      setErrorTextIndex(index);
      setTimeout(() => {
        setErrorText("");
      }, 3000);
    }
  };

  const handleDecrement = (index) => {
    if (cartItems[index].ordered_quantity > 1) {
      handleRemoveFromCart(cartItems[index].id);
    } else if (cartItems[index].ordered_quantity === 1) {
      handleDeleteFromCart(cartItems[index].id);
    }
  };

  const calculateItemTotal = (item) => {
    return Number(item.price) * item.ordered_quantity;
  };

  const calculateSubtotal = () => {
    let total = 0;
    cartItems.forEach((item) => {
      total += calculateItemTotal(item);
    });
    return total;
  };

  const handleCheckout = async () => {
    setOrderNote(note);
    router.push("checkout");
  };

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return null;
  }

  return (
    <div className="h-auto w-full pt-14 lg:px-28 max-lg:px-4">
      <title>Cart</title>
      <div className="flex flex-col items-center w-full gap-4">
        <h1 className="text-2xl pb-12">Shopping Cart</h1>
        <div className="flex flex-col w-full lg:w-1/2 gap-6 mt-4">
          {cartItems &&
            cartItems.map((item, index) => (
              <div
                className="flex flex-row w-full justify-between text-sm text-black"
                key={index}
              >
                <div className="w-2/3 flex flex-row items-start">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-20 w-20 object-cover"
                  />
                  <div className="flex pl-4 flex-col">
                    <p className="font-bold text-xs">{item.name}</p>
                    <p className="text-xs">size: {item.size}</p>
                    <p className="pt-4">Price: ${Number(item.price)}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-1/2 lg:w-1/5 px-2 text-center">
                  <div className="flex flex-row p-3 border border-gray-600 justify-between items-center">
                    <FiMinus
                      className="cursor-pointer"
                      onClick={() => handleDecrement(index)}
                    />
                    <input
                      className="w-1/2 active:outline-none focus:outline-none text-black text-center"
                      min={1}
                      max={item.totalQuantity}
                      value={cartItems[index].ordered_quantity}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        if (/^\d*$/.test(inputValue)) {
                          handleInputChange(e, index);
                        }
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "-" || e.key === "e" || e.key === "E") {
                          e.preventDefault();
                        }
                      }}
                    />
                    <FiPlus
                      className="cursor-pointer"
                      onClick={() => handleIncrement(index)}
                    />
                  </div>
                  {errorText && index === errorTextIndex ? (
                    <p className="text-xs text-red-500">{errorText}</p>
                  ) : null}
                  <p
                    className="text-xs text-red-500 underline hover:cursor-pointer text-right max-sm:hidden"
                    onClick={() => handleDeleteFromCart(item.id)}
                  >
                    Remove
                  </p>
                  <p className="text-right">
                    Total: ${calculateItemTotal(item)}
                  </p>
                </div>
              </div>
            ))}
        </div>
        <p className="text-sm font-semibold py-6">
          <a href="/shop" className="text-blue-500 underline">
            Continue Shopping
          </a>
        </p>
        <div className="flex flex-row w-full lg:w-1/2 justify-between py-4 border-y border-black">
          <p className="font-semibold">Subtotal</p>
          <p className="font-semibold">$ {calculateSubtotal()}</p>
        </div>
        <div className="flex flex-col max-lg:w-5/6 min-w-[400px] lg:w-1/2 items-center justify-center">
          <p className="text-xs text-gray-600">
            ADD A NOTE TO YOUR ORDER (optional)
          </p>
          <textarea
            className="w-1/2 border border-gray-400 active:outline-none focus:outline-none p-2 mt-2 text-sm"
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <button
          className="bg-black text-white p-4 active:outline-none text-sm mt-6 mb-6"
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Page;
