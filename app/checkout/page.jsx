"use client";

import React, { useContext, useState } from "react";
import { Context } from "@/app/context/page";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import Image from "next/image";

const CheckoutPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { cartItems, orderNote } = useContext(Context);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleOrderSubmit = async (data) => {
    try {
      setIsProcessing(true);
  
      const orderData = {
        id: Math.floor(Math.random() * 1000),
        cartItems: cartItems,
        customerInfo: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
        },
        note: orderNote,
        status: "Pending",
        totalPrice: calculateSubtotal(),
        createdAt: new Date().toISOString(),
      };
  
      localStorage.setItem("pendingOrder", JSON.stringify(orderData));
  
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderData }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url, error } = await response.json();
  
      if (error) {
        toast.error("Something went wrong. Please try again.", {
          position: "bottom-right",
        });
        return;
      }
  
      window.location.href = url;
    } catch (e) {
      console.error("Error:", e);
      toast.error("An error occurred. Please try again.", {
        position: "bottom-right",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen w-full pt-14 px-28">
      <h2 className="text-2xl font-semibold mb-8">Checkout</h2>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Order Summary Section */}
        <div className="lg:w-2/3">
          <div className="bg-white p-6 shadow-sm border mb-6">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 py-3 border-b">
                  <div className="w-24 h-24 relative flex-shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="flex-grow flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-800">
                        {item.ordered_quantity} x ${item.price}
                      </p>
                      <p className="font-medium mt-1">
                        ${calculateItemTotal(item)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">${calculateSubtotal()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information Section */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
            <div className="space-y-4">
              <div>
                <input
                  className="w-full border p-2"
                  placeholder="First Name"
                  {...register("firstName", {
                    required: "First Name is required",
                  })}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              
              <div>
                <input
                  className="w-full border p-2"
                  placeholder="Last Name"
                  {...register("lastName", { required: "Last Name is required" })}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
              
              <div>
                <input
                  className="w-full border p-2"
                  placeholder="Email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>
              
              <div>
                <input
                  className="w-full border p-2"
                  placeholder="Phone"
                  {...register("phone", {
                    required: "Phone is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Invalid phone number",
                    },
                  })}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <button
                className="w-full bg-[#333333] text-white p-4 text-sm disabled:opacity-50 hover:bg-black transition-colors"
                onClick={handleSubmit(handleOrderSubmit)}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "PROCEED TO PAYMENT"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;