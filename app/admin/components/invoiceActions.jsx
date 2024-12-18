import { useInvoiceEmail } from '@/app/hooks/useInvoiceEmail';
import { usePrintInvoice } from '@/app/hooks/usePrintInvoice';
import React from 'react';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// InvoiceActions Component
const InvoiceActions = ({ order }) => {
  const { 
    emailAddress, 
    setEmailAddress, 
    isSending, 
    emailStatus, 
    sendInvoice 
  } = useInvoiceEmail(order.customerInfo?.email);
  
  const { handlePrint } = usePrintInvoice();

  const handleSendEmail = async (e) => {
    e.preventDefault();
    await sendInvoice({
      elementId: "bill-content",
      orderId: order.id,
      customerName: `${order.customerInfo?.firstName} ${order.customerInfo?.lastName}`,
      total: order.totalPrice,
      note: order.note,
    });
  };

  return (
    <div className="bg-gray-50 px-8 py-6 print:hidden">
      {emailStatus && (
        <div className={`mb-4 p-4 rounded-lg border ${
          emailStatus.type === "error"
            ? "bg-red-50 border-red-200 text-red-800"
            : "bg-green-50 border-green-200 text-green-800"
        }`}>
          <p className="text-sm">{emailStatus.message}</p>
        </div>
      )}

      <form onSubmit={handleSendEmail} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
  );
};

const BillPopup = ({ order, onClose }) => {
    if (!order) return null;
  
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
                      {order.customerInfo?.firstName} {order.customerInfo?.lastName}
                    </p>
                    <p className="text-gray-600 mt-1">{order.customerInfo?.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Invoice Details
                  </h2>
                  <div className="mt-2">
                    <p className="text-gray-900">Date: {formattedDate}</p>
                    <p className="text-gray-900 mt-1">
                      Status: <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full">
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
  
            {order.note && (
              <div className="mt-8 border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Order Note
                </h3>
                <p className="text-gray-600 text-sm">{order.note}</p>
              </div>
            )}
  
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
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">
                      ${order.totalPrice?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          {/* Invoice Actions */}
          <InvoiceActions order={order} />
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
  
  export default BillPopup;