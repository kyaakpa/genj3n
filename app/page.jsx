"use client";
import Image from "next/image";
import React from "react";

const Home = () => {
  return (
    <div className="flex flex-col justify-end items-center lg:pt-12 max-lg:pt-16">
      <div className="flex max-sm:flex-col justify-between items-end p-4">
        <div className="p-10 w-full">
          <h1 className="text-6xl font-light pb-6">
            Hi, I am Phurpa<br></br> aka genjen
          </h1>
          <p className="text-lg">
            I am an artist. I love to draw. I am an artist. I love to draw. I am
            an artist. I love to draw. I am an artist. I love to draw.
          </p>
        </div>
        <div className="px-4 lg:w-[800px]">
          <Image
            src="/home7.png"
            alt="self portrait"
            width={300}
            height={300}
            className="w-full h-full"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
