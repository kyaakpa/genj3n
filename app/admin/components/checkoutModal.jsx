"use client";

import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";

const CheckoutModal = ({
  toggleModal,
  cartItems,
  calculateSubtotal,
  handleOrderSubmit,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="flex flex-row justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Checkout Modal</h2>
          <button onClick={toggleModal}>
            <RxCross2 className="text-2xl" />
          </button>
        </div>
        {currentStep === 1 && (
          <div>
            <h3 className="text-md font-semibold mb-2">Description</h3>
            <div className="flex flex-col gap-4">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-row items-center justify-between"
                >
                  <p>{item.name}</p>
                  <p>Quantity: {item.ordered_quantity}</p>
                  <p>$ {item.price * item.ordered_quantity}</p>
                </div>
              ))}
            </div>
            <p className="font-semibold mt-4">
              Subtotal: $ {calculateSubtotal()}
            </p>
            <button
              className="bg-black text-white p-4 rounded w-full mt-4"
              onClick={handleNextStep}
            >
              Next
            </button>
          </div>
        )}
        {currentStep === 2 && (
          <div>
            <h3 className="text-md font-semibold mb-2">Information</h3>
            <div className="flex flex-col gap-4">
              <input
                className="w-full border p-2 rounded"
                placeholder="Full Name"
              />
              <input
                className="w-full border p-2 rounded"
                placeholder="Email"
              />
              <input
                className="w-full border p-2 rounded"
                placeholder="Phone"
              />
            </div>
            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-300 text-black p-4 rounded"
                onClick={handlePrevStep}
              >
                Previous
              </button>
              <button
                className="bg-black text-white p-4 rounded"
                onClick={handleNextStep}
              >
                Next
              </button>
            </div>
          </div>
        )}
        {currentStep === 3 && (
          <div>
            <h3 className="text-md font-semibold mb-2">Address</h3>
            <input
              className="w-full border p-2 rounded mb-4"
              placeholder="Street Address"
            />
            <input
              className="w-full border p-2 rounded mb-4"
              placeholder="City"
            />
            <input
              className="w-full border p-2 rounded mb-4"
              placeholder="State/Province"
            />
            <input
              className="w-full border p-2 rounded mb-4"
              placeholder="Zip/Postal Code"
            />
            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-300 text-black p-4 rounded"
                onClick={handlePrevStep}
              >
                Previous
              </button>
              <button
                className="bg-black text-white p-4 rounded"
                onClick={handleNextStep}
              >
                Next
              </button>
            </div>
          </div>
        )}
        {currentStep === 4 && (
          <div>
            <h3 className="text-md font-semibold mb-2">Payment Details</h3>
            {/* Add your Stripe payment form here */}
            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-300 text-black p-4 rounded"
                onClick={handlePrevStep}
              >
                Previous
              </button>
              <button
                className="bg-black text-white p-4 rounded"
                onClick={handleOrderSubmit}
              >
                Place Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
