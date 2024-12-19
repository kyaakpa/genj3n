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
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const itemsPerPage = 9;
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

      // Sort orders by date
      const sortedData = data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );

      // Filter by date range if set
      const filteredByDate = sortedData.filter(order => {
        if (!dateRange.startDate && !dateRange.endDate) return true;
        
        const orderDate = new Date(order.createdAt);
        const start = dateRange.startDate ? new Date(dateRange.startDate) : null;
        const end = dateRange.endDate ? new Date(dateRange.endDate) : null;
        
        if (start && end) {
          return orderDate >= start && orderDate <= end;
        } else if (start) {
          return orderDate >= start;
        } else if (end) {
          return orderDate <= end;
        }
        return true;
      });

      const totalOrders = filteredByDate.length;
      setTotalPages(Math.ceil(totalOrders / itemsPerPage));
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedOrders = filteredByDate.slice(startIndex, endIndex);
      setOrders(paginatedOrders);
    } catch (err) {
      setError("Failed to fetch orders. Please try again later.");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, [currentPage, dateRange]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
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

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset to first page when changing date range
  };

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
          
          <div className="flex flex-col md:flex-row items-center w-full justify-between gap-4">
            <input
              className="w-full md:w-1/3 h-10 pl-2 border-2 border-gray-300 rounded-md"
              type="text"
              placeholder="Search by customer name or order ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <div className="flex flex-row gap-4">
              <input
                type="date"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateRangeChange}
                className="h-10 pl-2 border-2 border-gray-300 rounded-md"
              />
              <input
                type="date"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateRangeChange}
                className="h-10 pl-2 border-2 border-gray-300 rounded-md"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <span className="text-gray-500">Loading...</span>
            </div>
          ) : filteredOrders.length === 0 ? (
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
                    <th className="py-2 px-4 border text-left">Total Price</th>
                    <th className="py-2 px-4 border text-left">Date</th>
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
                          <a href={`/admin/orders/${order.docId}`}>#{order.id}</a>
                        </td>
                        <td className="py-4 px-4">
                          {order.customerInfo?.firstName ?? "N/A"}{" "}
                          {order.customerInfo?.lastName ?? ""}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`${textColor} ${bgColor} py-2 px-4 rounded-full`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          ${order.totalPrice?.toFixed(2) ?? "0.00"}
                        </td>
                        <td className="py-4 px-4">
                          {new Date(order.createdAt).toLocaleDateString()}
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

      {selectedOrder && (
        <BillPopup
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {orders.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center w-full my-4 sm:my-6 px-2 sm:px-4 gap-4">
          <div className="order-2 sm:order-1 text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            Showing page {currentPage} of {totalPages}
          </div>

          <div className="flex items-center order-1 sm:order-2 w-full sm:w-auto justify-center gap-2 sm:gap-4">
            <button
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-black text-white text-xs sm:text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:bg-gray-800"
              onClick={handlePrevPage}
              disabled={currentPage === 1 || loading}
            >
              Previous
            </button>
            <button
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-black text-white text-xs sm:text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:bg-gray-800"
              onClick={handleNextPage}
              disabled={currentPage === totalPages || loading}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;