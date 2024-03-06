"use client";
import { Context } from "@/app/context/page";
import React, { useState, useEffect, useContext } from "react";
import { PiShoppingCartSimple } from "react-icons/pi";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  const { cartItems } = useContext(Context);

  const cartItemsLength = cartItems.reduce((acc, curr) => {
    return acc + curr.quantity;
  }, 0);

  useEffect(() => {
    const handleScroll = () => {
      const isTop = window.scrollY === 0;
      setScrolled(!isTop);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navbarItems = [
    {
      name: "HOME",
      href: "/",
    },
    {
      name: "ABOUT",
      href: "/about",
    },
    {
      name: "GALLERY",
      href: "/gallery",
    },
    {
      name: "SHOP",
      href: "/shop",
    },
    {
      name: "CLASSES",
      href: "/classes",
    },
    {
      name: "CONTACT",
      href: "/contact",
    },
    {
      name: (
        <div className="flex flex-row items-center">
          <PiShoppingCartSimple size={22} />
          {cartItemsLength > 0 && (
            <span className="text-xs bg-[#c5a365] text-white rounded-full h-5 w-5 flex items-center justify-center ml-1">
              {cartItemsLength}
            </span>
          )}
        </div>
      ),
      href: "/cart",
    },
  ];

  return (
    <div
      className={`sticky top-0 bg-white ${
        scrolled ? "shadow-md" : ""
      } z-40 transition-all duration-300 ease-in-out`}
    >
      <div
        className={`w-full px-28  ${
          scrolled ? "py-6" : "py-12"
        } transition-all duration-300 ease-in-out`}
      >
        <div className="flex flex-row justify-between items-center">
          <img
            src="./logo.png"
            alt="kiran paintings logo"
            className={`w-32 transition-all duration-300 ease-in-out ${
              scrolled ? "w-20" : ""
            }`}
          />
          <div className="flex flex-row space-x-16 text-sm items-center">
            {navbarItems.map((item) => (
              <a
                href={item.href}
                key={item.name}
                className="hover:cursor-pointer hover:text-[#c5a365] transition-all duration-300 ease-in-out"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
