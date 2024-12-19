export const usePrintInvoice = () => {
    const handlePrint = () => {
      window.print();
    };
  
    return { handlePrint };
  };