import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bottom-0">
      <div className="text-sm bg-[#E3DED5] flex justify-between px-10 py-4">
        <div className="flex gap-3">
          <Link href="#">Facebook</Link>
          <Link href="#">Instagram</Link>
        </div>
        <div>© 2024 Phurpa Lama. All Rights Reserved.</div>
        <div>Site made by Team Webtion</div>
      </div>
    </footer>
  );
};

export default Footer;
