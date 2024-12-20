"use client";
import { useContext, useEffect, Suspense, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  doc,
  getDocs,
  collection,
  query,
  where,
  runTransaction,
} from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { Context } from "../context/page";

const ErrorContent = ({ errorCode }) => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md text-center max-w-md w-full">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-red-600">
        Error {errorCode}
      </h1>
      <p className="text-gray-600 mb-6">
        Invalid access detected. Redirecting to shop...
      </p>
      <div className="animate-spin h-8 w-8 border-4 border-[#333333] border-t-transparent rounded-full mx-auto"></div>
    </div>
  </div>
);

const SuccessContent = ({ router }) => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md text-center max-w-md w-full">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">
        Payment Successful!
      </h1>
      <p className="text-gray-600 mb-6">
        Thank you for your order. Your payment has been processed successfully.
      </p>
      <button
        onClick={() => router.push("/shop")}
        className="bg-[#333333] text-white px-6 py-2 rounded hover:bg-[#444444] transition-colors"
      >
        Continue Shopping
      </button>
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <span className="text-gray-500">Loading...</span>
  </div>
);

const PaymentSuccessContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const { clearCart } = useContext(Context);
  const processedRef = useRef(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const validateAndProcess = async () => {
      // Wait a moment to show error before redirect
      const redirectWithError = (code) => {
        setError(code);
        setTimeout(() => {
          router.push("/shop");
        }, 2000);
      };

      // Check for orderId and pending order
      if (!orderId || !localStorage.getItem("pendingOrder")) {
        redirectWithError(401);
        return;
      }

      const pendingOrderString = localStorage.getItem("pendingOrder");
      const pendingOrder = JSON.parse(pendingOrderString);

      // Validate orderId matches pending order
      if (parseInt(orderId) !== pendingOrder.id) {
        redirectWithError(403);
        return;
      }

      // Check if order already exists
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, where("id", "==", parseInt(orderId)));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        redirectWithError(409);
        return;
      }

      if (!processedRef.current) {
        processedRef.current = true;
        try {
          await runTransaction(db, async (transaction) => {
            const paintingReads = await Promise.all(
              pendingOrder.cartItems.map(async (item) => {
                const paintingRef = doc(db, "paintings", item.id);
                const paintingDoc = await transaction.get(paintingRef);

                if (!paintingDoc.exists()) {
                  throw new Error(`Painting ${item.id} not found`);
                }

                return {
                  ref: paintingRef,
                  currentQuantity: parseInt(paintingDoc.data().totalQuantity),
                  orderedQuantity: item.ordered_quantity,
                  item: item,
                };
              })
            );

            paintingReads.forEach(
              ({ currentQuantity, orderedQuantity, item }) => {
                const newQuantity = currentQuantity - orderedQuantity;
                if (newQuantity < 0) {
                  throw new Error(
                    `Insufficient stock for painting ${item.name}`
                  );
                }
              }
            );

            const newOrderRef = doc(collection(db, "orders"));
            transaction.set(newOrderRef, {
              ...pendingOrder,
              status: "Paid",
              payment: "Paid",
              updatedAt: new Date().toISOString(),
            });

            paintingReads.forEach(
              ({ ref, currentQuantity, orderedQuantity }) => {
                const newQuantity = currentQuantity - orderedQuantity;
                transaction.update(ref, {
                  totalQuantity: newQuantity.toString(),
                  updatedAt: new Date().toISOString(),
                });
              }
            );
          });

          // Send email confirmation
          const emailContent = {
            email: pendingOrder.customerInfo.email,
            orderId: pendingOrder.id,
            customerName: `${pendingOrder.customerInfo.firstName} ${pendingOrder.customerInfo.lastName}`,
            total: pendingOrder.totalPrice,
            items: pendingOrder.cartItems,
            note: pendingOrder.note,
          };

          await fetch("/api/send-order-confirmation", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(emailContent),
          });

          clearCart();
          localStorage.removeItem("pendingOrder");
          localStorage.removeItem("cartItems");
        } catch (error) {
          console.error("Error processing order:", error);
          processedRef.current = false;
          redirectWithError(500);
          return;
        }
      }
    };

    validateAndProcess();
  }, [orderId, clearCart, router]);

  if (error) {
    return <ErrorContent errorCode={error} />;
  }

  return <SuccessContent router={router} />;
};

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
