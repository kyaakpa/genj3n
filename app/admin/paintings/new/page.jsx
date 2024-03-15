"use client";

import AdminLayout from "@/app/admin-layout";
import React, { useState } from "react";
import { BiSolidImageAdd } from "react-icons/bi";
import { IoIosArrowRoundBack } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";
import { collection, addDoc } from "firebase/firestore";
import { db, imgDB } from "@/app/firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const router = useRouter();
  const [productInfo, setProductInfo] = useState({
    name: "",
    price: "",
    totalQuantity: "",
    size: "",
    description: "",
    imageUrl: "",
  });
  const [productImage, setProductImage] = useState(null);

  const handleDeleteImage = () => {
    setProductImage(null);
    setProductInfo({ ...productInfo, imageUrl: "" });
  };
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    uploadImageToFirebase(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductInfo({ ...productInfo, [name]: value });
  };

  const handleFileChange = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    uploadImageToFirebase(file);
  };

  const uploadImageToFirebase = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setProductImage(event.target.result);
      setProductInfo({ ...productInfo, imageUrl: event.target.result });

      const img = ref(imgDB, `images/${v4()}`);
      uploadBytes(img, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setProductInfo({ ...productInfo, imageUrl: url });
        });
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      await addDoc(collection(db, "paintings"), productInfo);
      setProductInfo({
        name: "",
        price: "",
        totalQuantity: "",
        size: "",
        description: "",
        imageUrl: "",
      });
      setProductImage(null);
      toast.success("Painting added successfully");
      router.push("/admin/paintings");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col items-start justify-between w-full px-28 h-full">
        <div className="flex flex-row items-start justify-between w-full gap-4 border-b-2 border-gray-200 pb-4 mt-8">
          <div className="flex flex-row gap-8">
            <button
              className="flex items-center text-blue-500 "
              onClick={() => router.push("/admin/paintings")}
            >
              <IoIosArrowRoundBack size={28} className="mr-2" />
              BACK
            </button>
            <h1 className="text-4xl  text-black">Add Painting</h1>
          </div>
        </div>

        <div className="flex flex-row items-start mt-8 w-full">
          <div className="flex flex-col w-1/2 pr-4 text-left gap-4">
            <div className="flex flex-row items-start gap-4">
              <h1 className="w-1/6">Name:</h1>
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="border border-gray-400 py-2 px-4 active:outline-none focus:outline-none w-full"
                value={productInfo.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-row items-start gap-4">
              <h1 className="w-1/6">Price:</h1>
              <input
                type="number"
                name="price"
                placeholder="Price"
                className="border border-gray-400 py-2 px-4 active:outline-none focus:outline-none w-full"
                value={productInfo.price}
                onChange={handleInputChange}
                min={1}
              />
            </div>
            <div className="flex flex-row items-start gap-4">
              <h1 className="w-1/6">Quantity:</h1>
              <input
                type="number"
                name="totalQuantity"
                placeholder="Quantity"
                className="border border-gray-400 py-2 px-4 active:outline-none focus:outline-none w-full"
                value={productInfo.totalQuantity}
                onChange={handleInputChange}
                min={1}
              />
            </div>
            <div className="flex flex-row items-start gap-4">
              <h1 className="w-1/6">Size:</h1>
              <input
                type="text"
                name="size"
                placeholder="Size"
                className="border border-gray-400 py-2 px-4 active:outline-none focus:outline-none w-full"
                value={productInfo.size}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-row items-start gap-4">
              <h1 className="w-1/6">Description:</h1>
              <textarea
                name="description"
                placeholder="Description"
                className="border border-gray-400 py-2 px-4 active:outline-none focus:outline-none w-full"
                value={productInfo.description}
                onChange={handleInputChange}
                rows={5}
              />
            </div>
          </div>

          <div className="flex flex-col w-1/2 relative">
            {productImage && (
              <div className="flex w-full items-start justify-end absolute top-0 right-0 p-4 ">
                <RxCross1
                  size={36}
                  className="text-white bg-gray-400 p-2 rounded-md hover:cursor-pointer"
                  onClick={handleDeleteImage}
                />
              </div>
            )}
            <div
              className="flex w-full items-center justify-end"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {productImage ? (
                <img
                  src={productImage}
                  alt="painting"
                  className="h-[350px] w-[500px] object-cover border border-black"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-[350px] w-[500px] border-2 border-dashed border-blue-500 bg-[#F3F6FB] gap-2 ">
                  <BiSolidImageAdd size={36} className="text-[#4C4F5E] " />
                  <p className="text-[#4C4F5E] text-sm font-semibold ">
                    <label
                      htmlFor="fileInput"
                      className="text-blue-500 underline hover:cursor-pointer"
                    >
                      Click to Upload{" "}
                    </label>
                    or Drag & Drop Image Here
                  </p>
                </div>
              )}
            </div>
            <input
              type="file"
              id="fileInput"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
        <div className="flex flex-row items-start gap-4 mt-8 ">
          <button className="bg-red-500 text-white p-2 w-40 active:outline-none text-sm">
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white p-2 w-40 active:outline-none text-sm"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Page;
