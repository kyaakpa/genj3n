"use client";

import PaintingCard from "@/components/ui/PaintingCard";
import PaintingViewModal from "@/components/ui/PaintingViewModal";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const [paintings, setPaintings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 9;

  const handleModal = (id) => {
    setIsModalOpen(!isModalOpen);
    setModalItem(id);
  };

  const getPaintings = async () => {
    setIsLoading(true); // Set loading state to true
    const querySnapshot = await getDocs(collection(db, "paintings"));
    const allPaintings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    allPaintings.reverse();
    const totalPaintings = allPaintings.length;
    setTotalPages(Math.ceil(totalPaintings / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedPaintings = allPaintings.slice(startIndex, endIndex);
    setPaintings(paginatedPaintings);
    setIsLoading(false); // Set loading state to false after data is fetched
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    getPaintings();
  }, [currentPage]);

  return (
    <div className="h-auto w-full pt-14 px-28">
      <div className="flex flex-col items-center w-full">
        <h1 className="text-4xl pb-12 font-semibold">Shop</h1>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <span className="text-gray-500">Loading...</span>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-y-4 gap-x-12">
            {paintings.map((item) => (
              <PaintingCard
                item={item}
                key={item.id}
                handleModal={handleModal}
              />
            ))}
          </div>
        )}
      </div>
      <PaintingViewModal
        isOpen={isModalOpen}
        closeModal={() => handleModal(null)}
        item={paintings.find((item) => item.id === modalItem)}
      />
      <div className="flex justify-between items-center w-full my-4 px-10">
        <div></div>
        <div className="flex items-center text-sm">
          <button
            className="mr-2 px-4 py-2 bg-black text-white cursor-pointer"
            onClick={handlePrevPage}
            disabled={currentPage === 1 || isLoading}
          >
            Prev
          </button>
          <span className="mx-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="ml-2 px-4 py-2 bg-black text-white cursor-pointer"
            onClick={handleNextPage}
            disabled={currentPage === totalPages || isLoading}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
