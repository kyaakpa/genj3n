import AdminLayout from "@/app/admin-layout";
import React from "react";
import OrderList from "../components/orders-list";

const page = () => {
  return (
    <AdminLayout>
      <OrderList />
    </AdminLayout>
  );
};

export default page;
