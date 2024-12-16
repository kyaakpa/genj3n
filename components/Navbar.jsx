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

  const uniqueItemsCount = cartItems.length;

  const navbarItems = [
    {
      name: "HOME",
      href: "/",
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
      name: "CONTACT",
      href: "/contact",
    },
    {
      name: (
        <div className="relative">
          <PiShoppingCartSimple size={22} />
          {uniqueItemsCount > 0 && (
            <span className="absolute -top-4 -right-4 bg-[#c5a365] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {uniqueItemsCount}
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
        className={`w-full lg:px-28 px-12  ${
          scrolled ? "py-6" : "py-12"
        } transition-all duration-300 ease-in-out`}
      >
        <div className="flex flex-row  justify-between items-center ">
          <img
            src="./logo1.png"
            alt="genj3n logo"
            className={`w-20 transition-all duration-300 ease-in-out ${
              scrolled ? "w-16" : ""
            }`}
          />
          <button className="lg:hidden self-end">
            <Hamburger size={32} toggled={isOpen} toggle={setOpen} />
          </button>

          <div className="hidden lg:flex flex-row space-x-16 text-sm items-center">
            {navbarItems.map((item) => (
              <Link
                href={item.href}
                key={item.name}
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
          <ul className="mt-16 lg:hidden">
            {navbarItems.map((item) => (
              <li key={item.name} className="p-2">
                <Link
                  href={item.href}
                  className="hover:cursor-pointer flex justify-end hover:text-[#c5a365] transition-all duration-300 ease-in-out "
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
