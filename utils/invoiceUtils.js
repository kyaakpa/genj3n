import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// utils/invoiceUtils.js
export const generatePDF = async (elementId) => {
    return new Promise((resolve, reject) => {
      const element = document.getElementById(elementId);
      if (!element) {
        reject(new Error("Element not found"));
        return;
      }
  
      // Force the element to be visible temporarily
      const originalDisplay = element.style.display;
      element.style.display = 'block';
      
      // Wait for browser to render
      requestAnimationFrame(async () => {
        try {
          const canvas = await html2canvas(element, {
            scale: 1, // Set scale to 1 for consistent output
            useCORS: true,
            backgroundColor: '#ffffff',
            windowWidth: 794, // A4 width in pixels at 96 DPI
            logging: false
          });
  
          // Initialize PDF with A4 size
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'pt', // Use points for more precise sizing
            format: 'a4'
          });
  
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
  
          // Calculate scaling to fit content to A4
          const aspectRatio = canvas.width / canvas.height;
          let imgWidth = pdfWidth;
          let imgHeight = pdfWidth / aspectRatio;
  
          // If height is too large, scale based on height instead
          if (imgHeight > pdfHeight) {
            imgHeight = pdfHeight;
            imgWidth = pdfHeight * aspectRatio;
          }
  
          // Convert canvas to JPEG data
          const imgData = canvas.toDataURL('image/jpeg', 1.0);
  
          // Add image to PDF
          pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
  
          // Restore original display style
          element.style.display = originalDisplay;
  
          resolve(pdf.output('datauristring').split(',')[1]);
        } catch (error) {
          console.error('PDF generation error:', error);
          element.style.display = originalDisplay;
          reject(error);
        }
      });
    });
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