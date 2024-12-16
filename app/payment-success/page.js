"use client";

import { useContext, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  doc,
  getDocs,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  runTransaction,
} from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { Context } from "../context/page";

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const {clearCart} = useContext(Context);

  useEffect(() => {
    const updateOrderAndStock = async () => {
      if (orderId) {
        try {
          // Get the pending order from localStorage
          const pendingOrderString = localStorage.getItem('pendingOrder');
          if (!pendingOrderString) {
            throw new Error("Order data not found");
          }

          const pendingOrder = JSON.parse(pendingOrderString);

          await runTransaction(db, async (transaction) => {
        
            const ordersRef = collection(db, "orders");
            const q = query(ordersRef, where("id", "==", parseInt(orderId)));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
              return; 
            }
    
            const pendingOrderString = localStorage.getItem('pendingOrder');
            if (!pendingOrderString) {
              return; 
            }

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

            paintingReads.forEach(({ currentQuantity, orderedQuantity, item }) => {
              const newQuantity = currentQuantity - orderedQuantity;
              if (newQuantity < 0) {
                throw new Error(`Insufficient stock for painting ${item.name}`);
              }
            });

           
            const newOrderRef = doc(collection(db, "orders"));
            const orderData = {
              ...pendingOrder,
              status: "Paid",
              payment: "Paid"
            };
            
            transaction.set(newOrderRef, orderData);

            paintingReads.forEach(({ ref, currentQuantity, orderedQuantity }) => {
              const newQuantity = currentQuantity - orderedQuantity;
              transaction.update(ref, {
                totalQuantity: newQuantity.toString()
              });
            });
          });

          console.log("Successfully updated order status and stock quantities");
          clearCart();
          localStorage.removeItem('pendingOrder');
          
        } catch (error) {
          console.error("Error updating order status:", error);
          localStorage.removeItem('pendingOrder');
        }
      }
    };

    updateOrderAndStock();
  }, [orderId, clearCart]);

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
