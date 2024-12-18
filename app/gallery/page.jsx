"use client";

import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import GalleryCard from "@/components/ui/GalleryCard";
import GalleryViewModal from "@/components/ui/GalleryViewModal";

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
    const querySnapshot = await getDocs(collection(db, "gallery"));
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
    setIsLoading(false);
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
        <h1 className="text-4xl pb-12 font-semibold">Gallery</h1>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <span className="text-gray-500">Loading...</span>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-y-4 gap-x-12">
            {paintings.map((item) => (
              <GalleryCard
                item={item}
                key={item.id}
                handleModal={handleModal}
              />
            ))}
          </div>
        )}
      </div>
      <GalleryViewModal
        isOpen={isModalOpen}
        closeModal={() => handleModal(null)}
        item={paintings.find((item) => item.id === modalItem)}
      />
      {
        paintings.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center w-full my-6 px-2 sm:px-4 md:px-6 lg:px-10 gap-4">
          <div className="order-2 sm:order-1 text-xs sm:text-sm text-gray-600">
            Showing page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center order-1 sm:order-2 w-full sm:w-auto justify-center">
            <button
              className="mr-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-black text-white text-sm  cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              onClick={handlePrevPage}
              disabled={currentPage === 1 || isLoading}
            >
              Previous
            </button>
            <button
              className="ml-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-black text-white text-sm  cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              onClick={handleNextPage}
              disabled={currentPage === totalPages || isLoading}
            >
              Next
            </button>
          </div>
        </div>
        )
      }
    </div>
  );
};

export default Page;
