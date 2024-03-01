"use client";

import React, { useState, useEffect } from "react";
import { PiShoppingCartSimple } from "react-icons/pi";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

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
      name: <PiShoppingCartSimple size={22} />,
      href: "/cart",
    },
  ];

  return (
    <div
      className={`sticky top-0 bg-white ${
        scrolled ? "shadow-sm" : ""
      } z-10 transition-all duration-300 ease-in-out`}
    >
      <div
        className={`w-full px-28  ${
          scrolled ? "py-6" : "py-12"
        } transition-all duration-300 ease-in-out`}
      >
        <div className="flex flex-row justify-between items-center ">
          <div>Kiran Paintings</div>
          <div className="flex flex-row space-x-16 text-sm items-center">
            {navbarItems.map((item) => (
              <a
                href={item.href}
                key={item.name}
                className="hover:cursor-pointer hover:text-gray-400 transition-all duration-300 ease-in-out"
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
