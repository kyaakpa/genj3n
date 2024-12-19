import { generatePDF, sendInvoiceEmail } from '@/utils/invoiceUtils';
import { useState } from 'react';

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const useInvoiceEmail = (initialEmail = "") => {
  const [emailAddress, setEmailAddress] = useState(initialEmail);
  const [isSending, setIsSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);

  const sendInvoice = async (invoiceData) => {
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
      const pdfData = await generatePDF(invoiceData.elementId);
      
      const emailContent = {
        email: emailAddress,
        orderId: invoiceData.orderId,
        customerName: invoiceData.customerName,
        total: invoiceData.total,
        pdfData: pdfData,
        note: invoiceData.note,
      };

      await sendInvoiceEmail(emailContent);

      setEmailStatus({
        type: "success",
        message: "Invoice sent successfully!",
      });
      setEmailAddress("");
    } catch (error) {
      setEmailStatus({
        type: "error",
        message: error.message || "Failed to send invoice. Please try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return {
    emailAddress,
    setEmailAddress,
    isSending,
    emailStatus,
    sendInvoice,
  };
};
