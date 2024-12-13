"use client";

import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { Context } from "@/app/context/page";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";

const CheckoutPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { cartItems } = useContext(Context);
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNextStep = () => {
    if (currentStep === 1) {
      const hasErrors =
        errors.firstName || errors.lastName || errors.email || errors.phone;

      if (hasErrors) {
        console.log(errors);
        toast.error("Please fill in all required fields");
        return;
      }
      setCurrentStep(currentStep + 1);
    }

    if (currentStep === 2) {
      const hasErrors =
        errors.street ||
        errors.city ||
        errors.state ||
        errors.postalCode ||
        errors.country;

      if (hasErrors) {
        toast.error("Please fill in all required fields");
        return;
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
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
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: data.country,
        },
        status: "Pending",
        payment: "Processing",
        totalPrice: calculateSubtotal(),
        createdAt: new Date(),
      };

      // Create Stripe Checkout session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderData }),
      });

      const { url, error } = await response.json();

      if (error) {
        toast.error("Something went wrong. Please try again.");
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (e) {
      console.error("Error:", e);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen w-full pt-14 px-28 flex items-start justify-center">
      <div className="w-full max-w-3xl">
        {/* Step indicators */}
        <div className="flex justify-between mb-2">
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2 text-sm ${
                currentStep === 1
                  ? "bg-black text-white border-black"
                  : "bg-gray-400 border-gray-400 text-white"
              }`}
            >
              1
            </div>
            <span>Information</span>
          </div>
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2 text-sm ${
                currentStep === 2
                  ? "bg-black text-white border-black"
                  : "bg-gray-400 border-gray-400 text-white"
              }`}
            >
              2
            </div>
            <span>Address</span>
          </div>
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2 text-sm ${
                currentStep === 3
                  ? "bg-black text-white border-black"
                  : "bg-gray-400 border-gray-400 text-white"
              }`}
            >
              3
            </div>
            <span>Review</span>
          </div>
        </div>
        <div className="w-full border border-b-[1px] mb-4" />

        {/* Step 1: Information */}
        {currentStep === 1 && (
          <div>
            <h3 className="text-md font-semibold mb-2">Information</h3>
            <div className="flex flex-col gap-4">
              <input
                className="w-full border p-2 rounded"
                placeholder="First Name"
                {...register("firstName", {
                  required: "First Name is required",
                })}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs">
                  {errors.firstName.message}
                </p>
              )}
              <input
                className="w-full border p-2 rounded"
                placeholder="Last Name"
                {...register("lastName", { required: "Last Name is required" })}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs">
                  {errors.lastName.message}
                </p>
              )}
              <input
                className="w-full border p-2 rounded"
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
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
              <input
                className="w-full border p-2 rounded"
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
                <p className="text-red-500 text-xs">{errors.phone.message}</p>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="bg-[#333333] text-white p-4 rounded text-sm"
                onClick={handleNextStep}
              >
                CONTINUE
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Address */}
        {currentStep === 2 && (
          <div>
            <h3 className="text-md font-semibold mb-2">Address</h3>
            <input
              className="w-full border p-2 rounded mb-4"
              placeholder="Street Address"
              {...register("street", { required: "Street is required" })}
            />
            {errors.street && (
              <p className="text-red-500 text-xs">{errors.street.message}</p>
            )}
            <input
              className="w-full border p-2 rounded mb-4"
              placeholder="City"
              {...register("city", { required: "City is required" })}
            />
            {errors.city && (
              <p className="text-red-500 text-xs">{errors.city.message}</p>
            )}
            <input
              className="w-full border p-2 rounded mb-4"
              placeholder="State/Province"
              {...register("state", { required: "State is required" })}
            />
            {errors.state && (
              <p className="text-red-500 text-xs">{errors.state.message}</p>
            )}
            <input
              className="w-full border p-2 rounded mb-4"
              placeholder="Zip/Postal Code"
              {...register("postalCode", {
                required: "Postal Code is required",
              })}
            />
            {errors.postalCode && (
              <p className="text-red-500 text-xs">
                {errors.postalCode.message}
              </p>
            )}
            <input
              className="w-full border p-2 rounded mb-4"
              placeholder="Country"
              {...register("country", { required: "Country is required" })}
            />
            {errors.country && (
              <p className="text-red-500 text-xs">{errors.country.message}</p>
            )}
            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-300 text-black p-4 rounded text-sm"
                onClick={handlePrevStep}
              >
                PREVIOUS
              </button>
              <button
                className="bg-[#333333] text-white p-4 rounded text-sm"
                onClick={handleNextStep}
              >
                CONTINUE
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {currentStep === 3 && (
          <div>
            <h3 className="text-md font-semibold mb-2">Review Order</h3>
            <div className="flex flex-row w-full justify-between text-sm text-black pb-4">
              <h1 className="text-sm font-semibold">Product</h1>
              <h1 className="text-sm font-semibold">Subtotal</h1>
            </div>
            <div className="w-full border border-b-1" />
            {cartItems.map((item) => (
              <div
                className="flex flex-row py-3 justify-between items-center border-b-2"
                key={item.id}
              >
                <h1 className="text-sm">
                  {item.name} x {item.ordered_quantity}
                </h1>
                <h1 className="text-sm">${calculateItemTotal(item)}</h1>
              </div>
            ))}
            <div className="flex flex-row w-full justify-between text-sm text-black border-b-2 py-3">
              <h1 className="text-sm font-semibold">Total</h1>
              <h1 className="text-sm font-semibold">${calculateSubtotal()}</h1>
            </div>

            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-300 text-black p-4 rounded text-sm"
                onClick={handlePrevStep}
              >
                PREVIOUS
              </button>
              <button
                className="bg-[#333333] text-white p-4 rounded text-sm disabled:opacity-50"
                onClick={handleSubmit(handleOrderSubmit)}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "PROCEED TO PAYMENT"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
