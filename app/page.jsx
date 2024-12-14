"use client";
import React from "react";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center">
      <div className="grid grid-cols-2 justify-between items-end">
        <div className="p-10">
          <h1 className="text-6xl font-light pb-6">Hi I am Phurpa Lama.</h1>
          <p className="text-lg">
            I am an artist. I love to draw. I am an artist. I love to draw. I am
            an artist. I love to draw. I am an artist. I love to draw.
          </p>
        </div>
        <div className="px-4 ml-96 mr-10">
          <img src="./home7.png" alt="self portrait" />
        </div>
      </div>
    </div>
  );
};

export default Home;
