"use client";
import React, { useState, useEffect, useContext } from "react";
import { PiShoppingCartSimple } from "react-icons/pi";
import Hamburger from "hamburger-react";
import Link from "next/link";
import { Context } from "@/app/context/page";

const Navbar = () => {
  const { cartItems } = useContext(Context);
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0); // Add this to track scroll position

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isTop = currentScrollY === 0;

      // Close hamburger menu if user has scrolled more than 16px
      if (Math.abs(currentScrollY - lastScrollY) > 16) {
        setOpen(false);
      }

      setScrolled(!isTop);
      setLastScrollY(currentScrollY);
    };

    // Check initial scroll position
    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]); // Add lastScrollY to dependencies

  const uniqueItemsCount = cartItems?.length || 0;

  const navbarItems = [
    {
      name: "HOME",
      href: "/",
    },
    {
      name: "GALLERY",
      href: "/gallery",
    },
    // {
    //   name: "SHOP",
    //   href: "/shop",
    // },
    {
      name: "COMMISSION",
      href: "/art-commission",
    },
    // {
    //   name: (
    //     <div className="relative">
    //       <PiShoppingCartSimple size={22} />
    //       {mounted && uniqueItemsCount > 0 && (
    //         <span className="absolute -top-4 -right-4 bg-[#c5a365] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
    //           {uniqueItemsCount}
    //         </span>
    //       )}
    //     </div>
    //   ),
    //   href: "/cart",
    // },
  ];

  return (
    <div
      className={`sticky top-0 bg-white ${
        mounted && scrolled ? "shadow-md" : ""
      } z-40 transition-all duration-300 ease-in-out`}
    >
      <div
        className={`w-full lg:px-28 px-12 max-[600px]:px-2 ${
          mounted && scrolled ? "py-6" : "py-12"
        } transition-all duration-300 ease-in-out`}
      >
        <div className="flex flex-row justify-between items-center">
          <img
            src="./logo1.png"
            alt="genj3n logo"
            className={`w-16 transition-all duration-300 ease-in-out ${
              mounted && scrolled ? "w-16" : ""
            }`}
          />
          <button className="lg:hidden self-end">
            <Hamburger size={32} toggled={isOpen} toggle={setOpen} />
          </button>
          <div className="hidden lg:flex flex-row space-x-16 text-sm items-center">
            {navbarItems.map((item) => (
              <Link
                href={item.href}
                key={typeof item.name === "string" ? item.name : item.href}
                className="hover:cursor-pointer hover:text-[#c5a365] transition-all duration-300 ease-in-out"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <div
          className="flex text-right justify-end"
          style={{
            maxHeight: isOpen ? "300px" : "0",
            overflow: "hidden",
            transition: "max-height 0.5s ease-in-out",
          }}
        >
          <ul className="mt-4 pr-2 lg:hidden">
            {navbarItems.map((item) => (
              <li
                key={typeof item.name === "string" ? item.name : item.href}
                className="p-2"
              >
                <Link
                  href={item.href}
                  className="hover:cursor-pointer flex justify-end hover:text-[#c5a365] transition-all duration-300 ease-in-out"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
