import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const generatePDF = async (elementId) => {
    const element = document.getElementById(elementId);
    if (!element) throw new Error("Element not found");
  
    try {
      // Hide elements marked for print hiding
      const printHiddenElements = element.querySelectorAll(".print\\:hidden");
      printHiddenElements.forEach((el) => (el.style.display = "none"));
  
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
  
      // Restore hidden elements
      printHiddenElements.forEach((el) => (el.style.display = ""));
  
      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
        compress: true,
      });
      
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
      
      return pdf.output("datauristring").split(",")[1];
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  };
  
export const sendInvoiceEmail = async (emailData) => {
    try {
      const response = await fetch("/api/send-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });
  
      const rawResponse = await response.text();
      
      let jsonResponse;
      try {
        jsonResponse = JSON.parse(rawResponse);
      } catch (parseError) {
        throw new Error(`Invalid JSON response: ${rawResponse}`);
      }
  
      if (!response.ok) {
        throw new Error(jsonResponse.error || "Failed to send email");
      }
  
      return jsonResponse;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
};