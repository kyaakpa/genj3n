import React from "react";
import AdminLayout from "@/app/admin-layout";
import GalleryPaintings from "../components/gallery-paintings";

const page = () => {
  return (
    <AdminLayout>
      <GalleryPaintings />
    </AdminLayout>
  );
};

export default page;
