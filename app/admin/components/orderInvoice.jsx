const OrderInvoice = ({ order }) => {
    return (
      <div id="invoice-content" className="hidden">
        <div className="bg-white p-8">
          <div className="flex justify-between">
            <div>
              <h1 className="text-3xl font-bold">INVOICE</h1>
              <p>#{order.id}</p>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-8">
            <div>
              <h2 className="font-semibold">Bill To</h2>
              <div className="mt-2">
                <p>{order.customerInfo.firstName} {order.customerInfo.lastName}</p>
                <p>{order.customerInfo.email}</p>
                <p>{order.customerInfo.phone}</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="font-semibold">Invoice Details</h2>
              <div className="mt-2">
                <p>Date: {new Date().toLocaleDateString()}</p>
                <p>Status: {order.status}</p>
              </div>
            </div>
          </div>
  
          <div className="mt-8">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Item</th>
                  <th className="text-center py-2">Qty</th>
                  <th className="text-right py-2">Price</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.cartItems.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{item.name}</td>
                    <td className="text-center py-2">{item.ordered_quantity}</td>
                    <td className="text-right py-2">${item.price}</td>
                    <td className="text-right py-2">
                      ${(item.price * item.ordered_quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
  
            <div className="mt-8 flex justify-end">
              <div className="w-64">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default OrderInvoice;