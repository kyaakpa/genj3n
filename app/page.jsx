"use client";
import Image from "next/image";
import React from "react";

const Home = () => {
  return (
    <div className="flex flex-col justify-end items-center lg:pt-12 max-lg:pt-16">
      <div className="flex max-sm:flex-col justify-between items-end p-4">
        <div className="p-10 w-full">
          <h1 className="text-6xl font-light pb-6">Hi, I am Genjen Lama</h1>
          <p className="text-lg leading-relaxed max-w-2xl">
            I am an abstract expressionist artist who transforms emotions into
            digital art. Through bold strokes and dynamic colors on my tablet, I
            create pieces that speak to the raw, authentic experiences of being
            human. My work is deeply personal yet universally relatable – each
            digital artwork a conversation between spontaneity and intention.
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
