"use client";

import { db } from "@/app/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const getOrders = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "orders"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
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

  useEffect(() => {
    getOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const customerName = `${order.customerInfo?.[0]?.firstName ?? ''} ${order.customerInfo?.[0]?.lastName ?? ''}`.toLowerCase();
    return customerName.includes(searchTerm.toLowerCase()) ||
           order.id.toLowerCase().includes(searchTerm.toLowerCase());
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
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Filters
            </button>
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
                    <th className="py-2 px-4 border text-left">Customer Name</th>
                    <th className="py-2 px-4 border text-left">Status</th>
                    <th className="py-2 px-4 border text-left">Payment</th>
                    <th className="py-2 px-4 border text-left">Total Price</th>
                    <th className="py-2 px-4 border text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const { textColor, bgColor } = getStatusStyle(order.status);
                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-100 font-semibold"
                      >
                        <td className="py-4 px-4 text-blue-500">
                          <a href={`/admin/orders/${order.id}`}>#{order.id}</a>
                        </td>
                        <td className="py-4 px-4">
                          {order.customerInfo?.[0]?.firstName ?? 'N/A'}{' '}
                          {order.customerInfo?.[0]?.lastName ?? ''}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`${textColor} ${bgColor} py-2 px-4 rounded-full`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">{order.payment ?? 'N/A'}</td>
                        <td className="py-4 px-4">
                          ${order.totalPrice?.toFixed(2) ?? '0.00'}
                        </td>
                        <td className="py-4 px-4">
                          <button 
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => {/* Add your edit logic here */}}
                          >
                            Edit
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
    </div>
  );
};

export default OrderList;