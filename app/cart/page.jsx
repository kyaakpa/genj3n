"use client";

import { prints } from "@/public/dummyData";
import React, { useContext, useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import { Context } from "../context/page";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/config";
import { FaCross } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import CheckoutModal from "../admin/components/checkoutModal";
import { useRouter } from "next/navigation";

const Page = () => {
  const { cartItems } = useContext(Context);
  const {
    handleAddToCart,
    handleRemoveFromCart,
    handleDeleteFromCart,
    handleInputChange,
  } = useContext(Context);

  const [errorText, setErrorText] = useState("");
  const [errorTextIndex, setErrorTextIndex] = useState(0);

  const [order, setOrder] = useState({
    items: cartItems,
    customerName: "",
    status: "Pending",
    payment: "Unpaid",
    totalPrice: 0,
    createdAt: new Date(),
  });

  const router = useRouter();

  const handleIncrement = (index) => {
    const totalQuantity = cartItems[index].totalQuantity;
    if (cartItems[index].quantity < totalQuantity) {
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

  const handleInput = (e) => {
    const { name, value } = e.target;
    setOrder({ ...order, [name]: value });
  };

  const handleOrderSubmit = async () => {
    try {
      await addDoc(collection(db, "orders"), {
        id: Math.floor(Math.random() * 1000),
        customerName: order.customerName,
        status: "Pending",
        payment: "Unpaid",
        totalPrice: calculateSubtotal(),
        createdAt: new Date(),
      });

      console.log("Document successfully written!");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleCheckout = async () => {
    router.push("checkout");
  };

  return (
    <div className="h-auto w-full  pt-14 px-28">
      <div className="flex flex-col items-center w-full gap-4">
        <h1 className="text-2xl pb-12">Shopping Cart</h1>
        <div className="flex flex-row w-1/2 justify-between font-semibold text-sm pb-2 border-b-2">
          <p className="w-3/6 text-left">Product</p>
          <p className="w-1/6 text-center">Price</p>
          <p className="w-1/6 text-center">Quantity</p>
          <p className="w-1/6 text-right">Total</p>
        </div>
        <div className="flex flex-col w-1/2 gap-6 mt-4">
          {cartItems.map((item, index) => (
            <div
              className="flex flex-row w-full justify-between text-sm text-black"
              key={index}
            >
              <div className="w-3/6 flex flex-row items-start">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-20 w-20 object-cover"
                />
                <div className="flex flex-col gap-4">
                  <p className="pl-4 font-bold text-xs">{item.name}</p>
                  <p className="pl-4 text-xs">{item.size}</p>
                </div>
              </div>
              <p className="w-1/6 text-center">$ {Number(item.price)}</p>
              <div className="flex flex-col gap-2 w-1/6 px-2 text-center text-gray-600">
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
                  className="text-xs text-red-500 underline hover:cursor-pointer"
                  onClick={() => handleDeleteFromCart(item.id)}
                >
                  Remove
                </p>
              </div>
              <p className="w-1/6 text-right">$ {calculateItemTotal(item)}</p>
            </div>
          ))}
        </div>
        <p className="text-sm font-semibold py-6">
          <a href="/shop" className="text-blue-500 underline">
            Continue Shopping
          </a>
        </p>
        <div className="flex flex-row w-1/2 justify-between py-4 border-y border-black">
          <p className=" font-semibold">Subtotal</p>
          <p className=" font-semibold">$ {calculateSubtotal()}</p>
        </div>
        <div className="flex flex-col w-1/2 items-center justify-center">
          <p className="text-xs text-gray-600">
            {" "}
            ADD A NOTE TO YOUR ORDER (optional)
          </p>
          <textarea
            className="w-1/2 border border-gray-400 active:outline-none focus:outline-none p-2 mt-2 text-sm"
            rows={4}
          />
        </div>
        <button
          className="bg-black text-white p-4 active:outline-none text-sm mt-6"
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Page;
