"use client";
import { useContext, useEffect, Suspense } from "react";
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

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <span className="text-gray-500">Loading...</span>
  </div>
);

// Main component wrapped with error boundary
const PaymentSuccessContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const { clearCart } = useContext(Context);



  useEffect(() => {
    const updateOrderAndStock = async () => {
      if (!orderId) {
        console.error("No order ID found");
        return;
      }
  
      try {
        const pendingOrderString = localStorage.getItem("pendingOrder");
        if (!pendingOrderString) {
          console.error("Order data not found");
          return;
        }
  
        const pendingOrder = JSON.parse(pendingOrderString);
  
        await runTransaction(db, async (transaction) => {
          // STEP 1: Perform all reads first
          // Check if order exists
          const ordersRef = collection(db, "orders");
          const q = query(ordersRef, where("id", "==", parseInt(orderId)));
          const querySnapshot = await getDocs(q);
  
          if (!querySnapshot.empty) {
            console.log("Order already processed");
            return;
          }
  
          // Read all painting documents
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
                item: item
              };
            })
          );
  
          // Verify stock levels
          paintingReads.forEach(({ currentQuantity, orderedQuantity, item }) => {
            const newQuantity = currentQuantity - orderedQuantity;
            if (newQuantity < 0) {
              throw new Error(`Insufficient stock for painting ${item.name}`);
            }
          });
  
          // STEP 2: Perform all writes after reads are complete
          // Create new order
          const newOrderRef = doc(collection(db, "orders"));
          transaction.set(newOrderRef, {
            ...pendingOrder,
            status: "Paid",
            payment: "Paid",
            updatedAt: new Date().toISOString(),
          });
  
          // Update all painting quantities
          paintingReads.forEach(({ ref, currentQuantity, orderedQuantity }) => {
            const newQuantity = currentQuantity - orderedQuantity;
            transaction.update(ref, {
              totalQuantity: newQuantity.toString(),
              updatedAt: new Date().toISOString(),
            });
          });
        });
  
        console.log("Successfully updated order status and stock quantities");
        clearCart();
        localStorage.removeItem("pendingOrder");
        localStorage.removeItem("cartItems");
      } catch (error) {
        console.error("Error updating order status:", error);
        // Keep the pending order in localStorage in case of error
        // Consider adding retry logic or user notification here
      }
    };
  
    updateOrderAndStock();
  }, [orderId]);

  return <SuccessContent router={router} />;
};

// Main export with Suspense boundary
export default function PaymentSuccess() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
