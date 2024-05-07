"use client";

import { db } from "@/app/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    const querySnapshot = await getDocs(collection(db, "orders"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setOrders(data);
  };

  console.log(orders);

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div className="h-auto w-full pt-6">
      <div className="flex flex-col items-start w-full">
        <div className="flex flex-col w-full px-8 pb-12 gap-4">
          <h1 className="text-2xl font-semibold">Orders</h1>
          <div className="flex flex-row items-center w-full justify-between">
            <input
              className="w-1/3 h-10 pl-2 border-2 border-gray-300 rounded-md"
              type="text"
              placeholder="Search"
            />
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Filters
            </button>
          </div>
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
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-100 font-semibold"
                  >
                    <td className="py-4 px-4 text-blue-500">
                      <a href={`/admin/orders/${order.id}`}>#{order.id}</a>
                    </td>
                    <td className="py-4 px-4">
                      {order.customerInfo[0].firstName}
                      {""}
                      {order.customerInfo[0].lastName}
                    </td>
                    {order.status === "Pending" ? (
                      <td className="py-4 px-4">
                        <span className="text-[#B79153] py-2 px-4  bg-[#FFECD0] rounded-full">
                          $ {order.status}
                        </span>
                      </td>
                    ) : (
                      <td className="py-4 px-4">
                        <span className="text-[#459D4F] py-2 px-4  bg-[#D9FFDD] rounded-full">
                          $ {order.status}
                        </span>
                      </td>
                    )}
                    <td className="py-4 px-4">{order.payment}</td>
                    <td className="py-4 px-4">$ {order.totalPrice}</td>
                    <td className="py-4 px-4">
                      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
