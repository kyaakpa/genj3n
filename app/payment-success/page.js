"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  doc,
  getDocs,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/app/firebase/config";

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    const updateOrderStatus = async () => {
      if (orderId) {
        try {
          // First, find the document with matching id field
          const ordersRef = collection(db, "orders");
          const q = query(ordersRef, where("id", "==", parseInt(orderId)));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            // Get the first matching document
            const orderDoc = querySnapshot.docs[0];

            // Update using the actual document ID
            await updateDoc(doc(db, "orders", orderDoc.id), {
              status: "Paid",
            });
          } else {
            console.error("Order not found");
          }
        } catch (error) {
          console.error("Error updating order status:", error);
        }
      }
    };

    updateOrderStatus();
  }, [orderId]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your order. Your payment has been processed
          successfully.
        </p>
        <button
          onClick={() => router.push("/shop")}
          className="bg-[#333333] text-white px-6 py-2 rounded"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
