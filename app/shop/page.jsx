"use client";
import PaintingCard from "@/components/ui/PaintingCard";
import PaintingViewModal from "@/components/ui/PaintingViewModal";
import {
  collection,
  getDocs,
  query,
  limit,
  startAfter,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";

const Page = () => {
  const [paintings, setPaintings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const itemsPerPage = 9;

  const handleModal = (id) => {
    setIsModalOpen(!isModalOpen);
    setModalItem(id);
  };

  useEffect(() => {
    const getTotalCount = async () => {
      try {
        const snapshot = await getDocs(collection(db, "paintings"));
        setTotalPages(Math.ceil(snapshot.size / itemsPerPage));
      } catch (error) {
        console.error("Error getting total count:", error);
      }
    };
    getTotalCount();
  }, []);

  useEffect(() => {
    const getPaintings = async () => {
      try {
        setIsLoading(true);
        let paintingsQuery;

        if (currentPage === 1) {
          paintingsQuery = query(
            collection(db, "paintings"),
            limit(itemsPerPage)
          );
        } else if (lastDoc) {
          paintingsQuery = query(
            collection(db, "paintings"),
            startAfter(lastDoc),
            limit(itemsPerPage)
          );
        }

        const querySnapshot = await getDocs(paintingsQuery);

        if (querySnapshot.empty) {
          setPaintings([]);
          return;
        }

        const fetchedPaintings = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setPaintings(fetchedPaintings);
      } catch (error) {
        console.error("Error fetching paintings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getPaintings();
  }, [currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      setLastDoc(null);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen w-full pt-8 md:pt-14 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-28">
      <div className="flex flex-col items-center w-full">
        <h1 className="text-2xl md:text-3xl lg:text-4xl pb-6 md:pb-12 font-semibold text-center">
          Shop
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-48 md:h-64">
            {/* <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-t-2 border-b-2 border-gray-900"></div> */}
            <span className="text-gray-500">Loading...</span>
          </div>
        ) : paintings.length === 0 ? (
          <div className="flex justify-center items-center h-48 md:h-64">
            <p className="text-gray-500 text-sm md:text-base">
              No paintings found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-12 w-full">
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

      {paintings.length > 0 && (
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
      )}
    </div>
  );
};

export default Page;
