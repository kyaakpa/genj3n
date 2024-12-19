"use client";

import { db } from "@/app/firebase/config";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import BillPopup from "./invoiceActions";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const router = useRouter();

  const getOrders = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "orders"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        docId: doc.id,
        ...doc.data(),
      }));
      setOrders(data);
    } catch (err) {
      setError("Failed to fetch orders. Please try again later.");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (orderId) => {
    if (!orderId) {
      console.error("No order ID provided for deletion");
      alert("Cannot delete order: Invalid order ID");
      return;
    }

    if (window.confirm(`Do you want to delete order#${orderId}?`)) {
      try {
        setDeletingOrderId(orderId);
        const orderRef = doc(db, "orders", orderId);
        await deleteDoc(orderRef);
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.docId !== orderId)
        );
        alert("Order deleted successfully");
      } catch (error) {
        console.error("Error removing document:", error);
        alert("Error removing order.");
      } finally {
        setDeletingOrderId(null);
      }
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (!order) return false;

    const customerName = `${order.customerInfo?.firstName ?? ""} ${
      order.customerInfo?.lastName ?? ""
    }`.toLowerCase();

    const searchValue = searchTerm.toLowerCase();

    return (
      customerName.includes(searchValue) ||
      order.docId?.toString().toLowerCase().includes(searchValue)
    );
  });

  const getStatusStyle = (status) => {
    return status === "Pending"
      ? { textColor: "text-[#B79153]", bgColor: "bg-[#FFECD0]" }
      : { textColor: "text-[#459D4F]", bgColor: "bg-[#D9FFDD]" };
  };

  if (loading) {
    return (
      <div className="h-auto w-full pt-6 px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-64 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-auto w-full pt-6 px-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="h-auto w-full pt-6">
      <div className="flex flex-col items-start w-full">
        <div className="flex flex-col w-full px-8 pb-12 gap-4">
          <h1 className="text-2xl font-semibold">Orders</h1>
          <div className="flex flex-row items-center w-full justify-between">
            <input
              className="w-1/3 h-10 pl-2 border-2 border-gray-300 rounded-md"
              type="text"
              placeholder="Search by customer name or order ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredOrders.length === 0 ? (
            <div className="w-full text-center py-8 text-gray-500">
              No orders found matching your search criteria.
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full border">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-2 px-4 border text-left">Order ID</th>
                    <th className="py-2 px-4 border text-left">
                      Customer Name
                    </th>
                    <th className="py-2 px-4 border text-left">Status</th>
                    <th className="py-2 px-4 border text-left">Total Price</th>
                    <th className="py-2 px-4 border text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    if (!order || !order.docId) return null;

                    const { textColor, bgColor } = getStatusStyle(order.status);
                    return (
                      <tr
                        key={order.docId}
                        className="hover:bg-gray-100 font-semibold"
                      >
                        <td className="py-4 px-4 text-blue-500">
                          <a href={`/admin/orders/${order.docId}`}>
                            #{order.id}
                          </a>
                        </td>
                        <td className="py-4 px-4">
                          {order.customerInfo?.firstName ?? "N/A"}{" "}
                          {order.customerInfo?.lastName ?? ""}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`${textColor} ${bgColor} py-2 px-4 rounded-full`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          ${order.totalPrice?.toFixed(2) ?? "0.00"}
                        </td>
                        <td className="py-4 px-4 space-x-2">
                          <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                            onClick={() => handleDelete(order.docId)}
                            disabled={deletingOrderId === order.docId}
                          >
                            {deletingOrderId === order.docId
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                          <button
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => setSelectedOrder(order)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Bill Popup */}
      {selectedOrder && (
        <BillPopup
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default OrderList;
