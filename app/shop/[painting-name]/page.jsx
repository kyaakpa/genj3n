"use client";

import { useContext, useEffect, useState } from "react";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import PaintingCard from "@/components/ui/PaintingCard";
import PaintingViewModal from "@/components/ui/PaintingViewModal";
import Link from "next/link";
import { Context } from "@/app/context/page";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const { handleAddToCart } = useContext(Context);
  const [isHoveredAndActive, setIsHoveredAndActive] = useState(false);
  const [painting, setPainting] = useState();
  const [paintings, setPaintings] = useState([]);
  const [productQuantity, setProductQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState(null);
  const [orderedQuantity, setOrderedQuantity] = useState(0);
  const handleModal = (id) => {
    setIsModalOpen(!isModalOpen);
    setModalItem(id);
  };

  const handleIncrement = () => {
    if (productQuantity < painting.totalQuantity) {
      setProductQuantity((prevState) => prevState + 1);
    }
  };

  const handleDecrement = () => {
    if (productQuantity > 1) {
      setProductQuantity((prevState) => prevState - 1);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value > painting.totalQuantity) {
      setProductQuantity(painting.totalQuantity);
    } else {
      setProductQuantity(value);
    }
  };

  useEffect(() => {
    if (painting) {
      const cartItems = JSON.parse(localStorage.getItem("cartItems"));
      const orderedItem = cartItems
        ? cartItems.find((cartItem) => cartItem.id === painting.id)
        : null;
      setOrderedQuantity(orderedItem ? orderedItem.ordered_quantity : 0);
    }
  }, [painting, handleAddToCart]);

  const handleClickAddToCart = () => {
    if (orderedQuantity >= painting.totalQuantity) {
      toast.error("You have reached the maximum quantity for this item.", {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        style: {
          fontSize: "14px",
          fontWeight: "500",
        },
      });
    } else {
      toast.success("Added to cart");
      handleAddToCart(painting, productQuantity);
      setProductQuantity(1);
    }
  };

  const handleCheckout = () => {
    handleClickAddToCart();
    router.push("/cart");
  };

  useEffect(() => {
    const url = window.location.href;
    let id = "";
    const encodedId = url.substring(url.lastIndexOf("/") + 1);
    try {
      id = decodeURIComponent(encodedId);
    } catch (e) {
      console.error(e);
    }

    const getPainting = async (id) => {
      try {
        const docRef = doc(db, "paintings", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPainting({ ...docSnap.data(), id });
        } else {
          console.log("No such document!");
        }
      } catch (e) {
        console.error(e);
      }
    };

    const getAllPaintings = async () => {
      const querySnapshot = await getDocs(collection(db, "paintings"));
      const paintings = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPaintings(paintings);
    };

    if (id) {
      getPainting(id);
      getAllPaintings();
    }
  }, []);

  if (!painting) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full px-28 h-full">
      <button className="flex items-center text-blue-500 pt-4">
        <a href="/shop" className="flex items-center text-sm">
          <IoIosArrowRoundBack size={28} className="mr-2" />
          BACK
        </a>
      </button>

      <div className="flex flex-row items-start">
        <div className="flex flex-col w-1/2 pr-4 text-left gap-4">
          <h1 className="text-4xl pt-4">{painting.name}</h1>
          <p className="text-2xl pt-2">$ {painting.price}</p>
          {painting.totalQuantity > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-sm pt-2">Quantity</p>
              <div
                className="flex flex-row w-20 h-10 border border-gray-400 px-4 hover:cursor-pointer transition-al duration-500 ease-in-out"
                onMouseEnter={() => setIsHoveredAndActive(true)}
                onMouseLeave={() => setIsHoveredAndActive(false)}
                onClick={() => setIsHoveredAndActive(true)}
              >
                <input
                  className="w-2/3 h-full active:outline-none focus:outline-none text-gray-400"
                  defaultValue={1}
                  min={1}
                  max={painting.totalQuantity}
                  value={productQuantity}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (/^\d*$/.test(inputValue)) {
                      handleInputChange(e);
                    }
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "-" || e.key === "e" || e.key === "E") {
                      e.preventDefault();
                    }
                  }}
                />
                {isHoveredAndActive && (
                  <div className="flex flex-col items-center justify-center w-1/3 h-full">
                    <p
                      className="text-xs text-gray-400"
                      onClick={handleIncrement}
                    >
                      <MdOutlineKeyboardArrowUp size={20} />
                    </p>
                    <p
                      className="text-xs text-gray-400"
                      onClick={handleDecrement}
                    >
                      <MdOutlineKeyboardArrowDown size={20} />
                    </p>
                  </div>
                )}
              </div>
              <p className="text-xs text-red-500">
                Only {painting.totalQuantity} left in stock - order soon.{" "}
              </p>
            </div>
          )}
          {painting.totalQuantity <= 0 && (
            <button className="w-full text-white p-4 mt-6 text-sm bg-gray-500 opacity-50 cursor-not-allowed">
              Out of Stock
            </button>
          )}
          {painting.totalQuantity > 0 && (
            <button
              className="w-full text-white p-4 mt-6 text-sm bg-[#c5a365] hover:bg-[#c9ae7c]"
              onClick={handleClickAddToCart}
            >
              Add to Cart - $ {painting.price}
            </button>
          )}
          {painting.totalQuantity > 0 && (
            <button
              className="w-full  text-white p-4 text-sm bg-black hover:bg-[#424141]"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          )}
          <div className="flex flex-col text-sm mt-2">
            <p>{painting.name}</p>
            <p>{painting.description}</p>
            <p>Size: {painting.size}</p>
          </div>
        </div>
        <div className="flex flex-col w-1/2  ">
          <div className="flex w-full items-center justify-end">
            <img src={painting.imageUrl} alt="painting" className="" />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full mt-12">
        <div className="flex flex-row items-center justify-between w-full ">
          <h1 className="text-2xl">Related Products</h1>
          <Link
            href="/shop"
            className="flex items-center text-[#c5a365] text-sm"
          >
            <p>View All</p>
            <IoIosArrowRoundForward size={28} className="ml-2" />
          </Link>
        </div>
        <div className="flex flex-row gap-4 w-full items-center justify-between mt-8">
          {paintings
            .filter((item) => item.id !== painting.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map((item, index) => (
              <PaintingCard item={item} key={index} handleModal={handleModal} />
            ))}
        </div>
      </div>
      <PaintingViewModal
        isOpen={isModalOpen}
        closeModal={() => handleModal(null)}
        item={paintings.find((item) => item.id === modalItem)}
      />
    </div>
  );
};

export default Page;
