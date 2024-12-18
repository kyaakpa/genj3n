"use client";

import { db } from "@/app/firebase/config";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRouter } from "next/navigation";

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
      console.log(data);
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

  // Professional bill popup component
  const BillPopup = ({ order, onClose }) => {
    if (!order) return null;

    const [emailAddress, setEmailAddress] = useState(
      order.customerInfo?.email || ""
    );
    const [isSending, setIsSending] = useState(false);
    const [emailStatus, setEmailStatus] = useState(null);

    const handlePrint = () => {
      window.print();
    };

    const generatePDF = async () => {
      // Get the bill content div (add an id to the content div)
      const billContent = document.getElementById("bill-content");

      try {
        // Remove print:hidden elements temporarily
        const printHiddenElements =
          billContent.querySelectorAll(".print\\:hidden");
        printHiddenElements.forEach((el) => (el.style.display = "none"));

        const canvas = await html2canvas(billContent, {
          scale: 2,
          useCORS: true,
          logging: false,
        });

        // Restore print:hidden elements
        printHiddenElements.forEach((el) => (el.style.display = ""));

        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(
          canvas.toDataURL("image/png"),
          "PNG",
          0,
          0,
          imgWidth,
          imgHeight
        );
        return pdf.output("datauristring").split(",")[1]; // Returns base64 string
      } catch (error) {
        console.error("Error generating PDF:", error);
        throw error;
      }
    };

    const handleSendEmail = async (e) => {
      e.preventDefault();
      if (!emailAddress) {
        setEmailStatus({
          type: "error",
          message: "Please enter an email address",
        });
        return;
      }

      setIsSending(true);
      setEmailStatus(null);

      try {
        // Generate PDF
        const pdfData = await generatePDF();

        // Create email content with PDF data
        const emailContent = {
          email: emailAddress,
          orderId: order.id,
          customerName: `${order.customerInfo?.firstName} ${order.customerInfo?.lastName}`,
          total: order.totalPrice,
          pdfData: pdfData,
        };

        const response = await fetch("/api/send-invoice", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emailContent),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to send email");
        }

        setEmailStatus({
          type: "success",
          message: "Invoice sent successfully!",
        });
        setEmailAddress("");
      } catch (error) {
        console.error("Error sending email:", error);
        setEmailStatus({
          type: "error",
          message: error.message || "Failed to send invoice. Please try again.",
        });
      } finally {
        setIsSending(false);
      }
    };
    const formattedDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 print:p-0">
        <div
          id="bill-content"
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full print:shadow-none print:max-w-full"
        >
          {/* Header Section */}
          <div className="border-b">
            <div className="p-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
                  <p className="text-gray-600 mt-1">#{order.id}</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 print:hidden"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-8">
                <div>
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Bill To
                  </h2>
                  <div className="mt-2">
                    <p className="text-gray-900 font-medium">
                      {order.customerInfo?.firstName}{" "}
                      {order.customerInfo?.lastName}
                    </p>
                    <p className="text-gray-600 mt-1">
                      {order.customerInfo?.email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Invoice Details
                  </h2>
                  <div className="mt-2">
                    <p className="text-gray-900">Date: {formattedDate}</p>
                    <p className="text-gray-900 mt-1">
                      Status:
                      <span
                        className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full `}
                      >
                        {order.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="p-8">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-semibold text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="text-center py-3 font-semibold text-gray-500 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="text-right py-3 font-semibold text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="text-right py-3 font-semibold text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.cartItems?.map((item, index) => (
                  <tr key={index}>
                    <td className="py-4">
                      <p className="text-gray-900 font-medium">{item.name}</p>
                    </td>
                    <td className="py-4 text-center text-gray-600">
                      {item.ordered_quantity}
                    </td>
                    <td className="py-4 text-right text-gray-600">
                      ${item.price}
                    </td>
                    <td className="py-4 text-right text-gray-900 font-medium">
                      ${(item.price * item.ordered_quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary */}
            <div className="mt-8 border-t pt-8">
              <div className="flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900 font-medium">
                      ${order.totalPrice?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-4">
                    <span className="text-lg font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      ${order.totalPrice?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Email Form Section */}
          <div className="bg-gray-50 px-8 py-6 print:hidden">
            {emailStatus && (
              <div
                className={`mb-4 p-4 rounded-lg border ${
                  emailStatus.type === "error"
                    ? "bg-red-50 border-red-200 text-red-800"
                    : "bg-green-50 border-green-200 text-green-800"
                }`}
              >
                <p className="text-sm">{emailStatus.message}</p>
              </div>
            )}

            <form onSubmit={handleSendEmail} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Send Invoice to Email
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter email address"
                  />
                  <button
                    type="submit"
                    disabled={isSending}
                    className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isSending ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <svg
                          className="h-4 w-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        Send Invoice
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handlePrint}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <svg
                  className="h-4 w-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Print Invoice
              </button>
            </div>
          </div>
        </div>

        {/* Print Styles */}
        <style jsx global>{`
          @media print {
            body * {
              visibility: hidden;
            }
            .bg-black.bg-opacity-50 {
              background: none !important;
            }
            .max-w-2xl {
              margin: 0 !important;
              padding: 0 !important;
            }
            .bg-white,
            .bg-white * {
              visibility: visible;
            }
            .bg-white {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .print\\:hidden {
              display: none !important;
            }
            .rounded-lg {
              border-radius: 0 !important;
            }
            @page {
              size: A4;
              margin: 20mm;
            }
            table {
              page-break-inside: auto;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
          }
        `}</style>
      </div>
    );
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
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() =>
                              router.push(`/admin/orders/${order.docId}/edit`)
                            }
                          >
                            Edit
                          </button>
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
