import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bottom-0">
      <div className="text-sm lg:bg-[#E3DED5] flex lg:justify-between max-lg:flex-col max-lg:items-center max-lg:gap-2 max-lg:text-center px-10 py-2">
        <div className="flex gap-3">
          <Link href="https://www.facebook.com/profile.php?id=100088701407767">
            Facebook
          </Link>
          <Link href="https://www.instagram.com/genj3n/">Instagram</Link>
          <Link href="https://www.tiktok.com/@genj3n_">Tiktok</Link>
        </div>
        <div>© 2024 Phurpa All Rights Reserved.</div>
        <div>Site made by Team Webtion</div>
      </div>
    </footer>
  );
};

export default Footer;
