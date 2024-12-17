"use client";

import OrderReceipt from '@/app/admin/components/orderReceipt';
import { useParams } from 'next/navigation';

const ReceiptPage = () => {
  const params = useParams();
  
  return <OrderReceipt orderId={params.id} />;
};

export default ReceiptPage;