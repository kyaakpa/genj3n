"use client";
import React from "react";

const Home = () => {
  return (
    <div className="flex flex-col justify-center items-center lg:mt-20 max-lg:pb-20">
      <div className="flex max-sm:flex-col justify-between items-end">
        <div className="p-10 w-full">
          <h1 className="text-6xl font-light pb-6">Hi I am Phurpa Lama.</h1>
          <p className="text-lg">
            I am an artist. I love to draw. I am an artist. I love to draw. I am
            an artist. I love to draw. I am an artist. I love to draw.
          </p>
        </div>
        <div className="px-4 lg:w-[800px]">
          <img src="./home7.png" alt="self portrait" />
        </div>
      </div>
    </div>
  );
};

export default Home;
