import React from "react";
import PaintingsList from "../components/paintings-list";
import AdminLayout from "@/app/admin-layout";

const page = () => {
  return (
    <AdminLayout>
      <PaintingsList />
    </AdminLayout>
  );
};

export default page;
