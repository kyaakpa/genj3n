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
    setIsLoading(true);
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
    <>
      <title>Gallery</title>
      <div className="h-auto w-full pt-8 sm:pt-10 md:pt-12 lg:pt-14 px-4 sm:px-8 md:px-16 lg:px-28">
        <div className="flex flex-col items-center w-full">
          <h1 className="text-2xl sm:text-3xl md:text-4xl pb-6 sm:pb-8 md:pb-12 font-semibold">
            Gallery
          </h1>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <span className="text-gray-500">Loading...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-12 w-full">
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

        {paintings.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center w-full my-4 sm:my-6 px-2 sm:px-4 gap-4">
            <div className="order-2 sm:order-1 text-xs sm:text-sm text-gray-600 text-center sm:text-left">
              Showing page {currentPage} of {totalPages}
            </div>

            <div className="flex items-center order-1 sm:order-2 w-full sm:w-auto justify-center gap-2 sm:gap-4">
              <button
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-black text-white text-xs sm:text-sm rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:bg-gray-800"
                onClick={handlePrevPage}
                disabled={currentPage === 1 || isLoading}
              >
                Previous
              </button>
              <button
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-black text-white text-xs sm:text-sm rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:bg-gray-800"
                onClick={handleNextPage}
                disabled={currentPage === totalPages || isLoading}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Page;
