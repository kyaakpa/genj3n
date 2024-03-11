"use client";

import { useState, useEffect } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";
import { prints } from "@/public/dummyData";
import { useRouter } from "next/navigation";
import AdminLayout from "@/app/admin-layout";
import { BiSolidImageAdd } from "react-icons/bi";

const Page = () => {
  const router = useRouter();
  const [productInfo, setProductInfo] = useState({
    name: "",
    price: "",
    status: "",
    image: "",
    description: "",
    size: "",
    quantity: 0,
    totalQuantity: 0,
  });
  const [productImage, setProductImage] = useState();

  const handleDeleteImage = () => {
    setProductImage(""); // Remove the image
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setProductImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    const url = window.location.href;
    let decodedText = "";
    const shopIndex = url.indexOf("/admin/paintings/");
    if (shopIndex !== -1) {
      const textAfterShop = url.substring(
        shopIndex + "/admin/paintings/".length
      );
      const decoded = decodeURIComponent(textAfterShop);
      decodedText = decoded;
    }

    if (decodedText) {
      const product = prints.find(
        (item) => item.name.replace(/ /g, "").toLowerCase() === decodedText
      );
      if (product) {
        setProductInfo(product);
        setProductImage(product.image);
      }
    }
  }, []);

  const handleFileChange = (event) => {
    event.preventDefault();
    const fileInput = document.createElement("input");
    fileInput.setAttribute("type", "file");
    fileInput.setAttribute("accept", "image/*");
    fileInput.click();
    fileInput.onchange = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setProductImage(event.target.result);
      };
      reader.readAsDataURL(file);
    };
  };

  console.log(productInfo);
  console.log(productImage);

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
            <h1 className="text-4xl  text-black">Edit Painting</h1>
          </div>
          <div className="flex flex-row gap-4 ">
            <button
              className="bg-red-500 text-white p-2 w-[100px] active:outline-none text-xs rounded-xl"
              onClick={handleDeleteImage}
            >
              Delete
            </button>
            <button className="bg-blue-500 text-white p-2 w-[100px] active:outline-none text-xs rounded-xl">
              Save
            </button>
          </div>
        </div>

        <div className="flex flex-row items-start mt-8 w-full">
          <div className="flex flex-col w-1/2 pr-4 text-left gap-4">
            <div className="flex flex-row items-start gap-4">
              <h1 className="w-1/6">Name:</h1>
              <input
                type="text"
                placeholder="Name"
                className="border border-gray-400 py-2 px-4 active:outline-none focus:outline-none w-full"
                value={productInfo.name}
              />
            </div>
            <div className="flex flex-row items-start gap-4">
              <h1 className="w-1/6">Price:</h1>
              <input
                type="number"
                placeholder="Price"
                className="border border-gray-400 py-2 px-4 active:outline-none focus:outline-none w-full"
                value={productInfo.price}
                min={1}
              />
            </div>
            <div className="flex flex-row items-start gap-4">
              <h1 className="w-1/6">Quantity:</h1>
              <input
                type="number"
                placeholder="Quantity"
                className="border border-gray-400 py-2 px-4 active:outline-none focus:outline-none w-full"
                value={productInfo.totalQuantity}
                min={1}
              />
            </div>
            <div className="flex flex-row items-start gap-4">
              <h1 className="w-1/6">Size:</h1>
              <input
                type="text"
                placeholder="Size"
                className="border border-gray-400 py-2 px-4 active:outline-none focus:outline-none w-full"
                value={productInfo.size}
              />
            </div>
            <div className="flex flex-row items-start gap-4">
              <h1 className="w-1/6">Description:</h1>
              <textarea
                placeholder="Description"
                className="border border-gray-400 py-2 px-4 active:outline-none focus:outline-none w-full"
                value={productInfo.description}
                rows={5}
              />
            </div>
          </div>

          <div className="flex flex-col w-1/2 relative ">
            <div className="flex w-full items-start justify-end absolute top-0 right-0 p-4 ">
              <RxCross1
                size={36}
                className="text-white bg-gray-400 p-2 rounded-md hover:cursor-pointer"
                onClick={handleDeleteImage}
              />
            </div>
            <div
              className="flex w-full items-center justify-end"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {productImage && (
                <img
                  src={productImage}
                  alt="painting"
                  className="h-[350px] w-[500px] object-cover border border-black"
                />
              )}
              {!productImage && (
                <div className="flex flex-col items-center justify-center h-[350px] w-[500px] border-2 border-dashed border-blue-500 bg-[#F3F6FB] gap-2 ">
                  <BiSolidImageAdd size={36} className="text-[#4C4F5E] " />
                  <p className="text-[#4C4F5E] text-sm font-semibold ">
                    <a
                      className="text-blue-500 underline hover:cursor-pointer"
                      onClick={handleFileChange}
                    >
                      Click to Upload{" "}
                    </a>
                    or Drag & Drop Image Here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Page;
