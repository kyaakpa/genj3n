import React from "react";
import { PiShoppingCartSimple } from "react-icons/pi";

const Navbar = () => {
  return (
    <div className="w-full border border-black px-28 py-12">
      <div className="flex flex-row justify-between items-center">
        <div>Kiran Paintings</div>
        <div className="flex flex-row space-x-16 text-sm items-center">
          <p>HOME</p>
          <p>ABOUT</p>
          <p>GALLERY</p>
          <p>CLASSES</p>
          <p>CONTACT</p>
          <p>
            <PiShoppingCartSimple size={22} />
          </p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
