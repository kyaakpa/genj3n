import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bottom-0">
      <div className="bg-orange-100 flex justify-between p-20">
        <div>
          <p className="text-2xl">Want your kids to learn painting? </p>
          <button
            className="tracking-tight bg-black text-white p-3 mt-3"
            type="button"
          >
            Enquire Now
          </button>
        </div>
        <div>
          <h3 className="font-medium text-xl">Class Hours</h3>
          <ul className="text-sm mt-2">
            <li>Mon-Fri: 4:30pm - 6:00pm </li>
            <li>Sat: 4:30pm - 6:00pm </li>
            <li>Sun: 4:30pm - 6:00pm </li>
          </ul>
        </div>
        <div>
          <h3 className="font-medium text-xl">Contact</h3>
          <ul className="text-sm mt-2">
            <li>42 Childs Street </li>
            <li>South Morang</li>
            <li>Melbourne, Australia</li>
          </ul>
        </div>
      </div>
      <div className="text-sm bg-orange-100 flex justify-between gap-4 px-20 py-4">
        <div className="flex gap-3">
          <Link href="#">Facebook</Link>
          <Link href="#">Instagram</Link>
        </div>
        <div>© 2024 Kiran Gurung. All Rights Reserved.</div>
        <div>Site made by Team Webtion</div>
      </div>
    </footer>
  );
};

export default Footer;
