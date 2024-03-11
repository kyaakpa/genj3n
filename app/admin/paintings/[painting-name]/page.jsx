"use client";

import { useState, useEffect } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";
import { prints } from "@/public/dummyData";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "@/app/admin-layout";
import { BiSolidImageAdd } from "react-icons/bi";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db, imgDB } from "@/app/firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

const Page = () => {
  const router = useRouter();

  const [productImage, setProductImage] = useState();
  const [painting, setPainting] = useState();
  const [id, setId] = useState();
  const handleDeleteImage = () => {
    setProductImage(null);
    setPainting({ ...painting, imageUrl: "" });
  };
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    uploadImageToFirebase(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
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
      setPainting({ ...painting, imageUrl: event.target.result });

      const img = ref(imgDB, `images/${v4()}`);
      uploadBytes(img, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setPainting({ ...painting, imageUrl: url });
        });
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "paintings", id));
      router.push("/admin/paintings");
      console.log("Document successfully deleted!");
    } catch (e) {
      console.error("Error removing document: ", e);
    }
  };

  const handleSave = async () => {
    try {
      await setDoc(doc(db, "paintings", id), {
        ...painting,
      });
      setPainting({
        name: "",
        price: "",
        totalQuantity: "",
        size: "",
        description: "",
        imageUrl: "",
      });
      setProductImage(null);
      router.push("/admin/paintings");
      console.log("Document successfully written!");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  useEffect(() => {
    const url = window.location.href;
    let id = "";
    const encodedId = url.substring(url.lastIndexOf("/") + 1);
    try {
      id = decodeURIComponent(encodedId);
      setId(id);
    } catch (e) {
      console.error(e);
    }

    const getPainting = async (id) => {
      try {
        const docRef = doc(db, "paintings", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPainting(docSnap.data());
          if (docSnap.data().imageUrl) {
            setProductImage(docSnap.data().imageUrl);
          }
        } else {
          console.log("No such document!");
        }
      } catch (e) {
        console.error(e);
      }
    };
    if (id) {
      getPainting(id);
    }
  }, []);

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
        </div>

        {painting && (
          <div className="flex flex-row items-start mt-8 w-full">
            <div className="flex flex-col w-1/2 pr-4 text-left gap-4">
              <div className="flex flex-row items-start gap-4">
                <h1 className="w-1/6">Name:</h1>
                <input
                  type="text"
                  placeholder="Name"
                  className="border border-gray-400 py-2 px-4 active:outline-none focus:outline-none w-full"
                  defaultValue={painting.name}
                  onChange={(e) =>
                    setPainting({ ...painting, name: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-row items-start gap-4">
                <h1 className="w-1/6">Price:</h1>
                <input
                  type="number"
                  placeholder="Price"
                  className="border border-gray-400 py-2 px-4 active:outline-none focus:outline-none w-full"
                  defaultValue={painting.price}
                  min={1}
                  onChange={(e) =>
                    setPainting({ ...painting, price: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-row items-start gap-4">
                <h1 className="w-1/6">Quantity:</h1>
                <input
                  type="number"
                  placeholder="Quantity"
                  className="border border-gray-400 py-2 px-4 active:outline-none focus:outline-none w-full"
                  defaultValue={painting.totalQuantity}
                  min={1}
                  onChange={(e) =>
                    setPainting({ ...painting, totalQuantity: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-row items-start gap-4">
                <h1 className="w-1/6">Size:</h1>
                <input
                  type="text"
                  placeholder="Size"
                  className="border border-gray-400 py-2 px-4 active:outline-none focus:outline-none w-full"
                  defaultValue={painting.size}
                  onChange={(e) =>
                    setPainting({ ...painting, size: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-row items-start gap-4">
                <h1 className="w-1/6">Description:</h1>
                <textarea
                  placeholder="Description"
                  className="border border-gray-400 py-2 px-4 active:outline-none focus:outline-none w-full"
                  defaultValue={painting.description}
                  rows={5}
                  onChange={(e) =>
                    setPainting({ ...painting, description: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex flex-col w-1/2 relative ">
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
                {productImage && (
                  <img
                    src={painting.imageUrl}
                    alt="painting"
                    className="h-[350px] w-[500px] object-cover border border-black"
                  />
                )}
                {!productImage && (
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
        )}
        <div className="flex flex-row items-start gap-4 mt-8 ">
          <button
            className="bg-red-500 text-white p-2 w-40 active:outline-none text-sm"
            onClick={handleDelete}
          >
            Delete
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
