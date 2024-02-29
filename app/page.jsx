"use client";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

const Home = () => {
  const h1 = `Fashion & Lifestyle Illustration`;
  return (
    <div className="flex justify-center">
      <div className="flex w-[1200px]">
        <div className=" text-center flex items-center flex-col gap-4 justify-center bg-red-200 w-[800px]">
          <h1 className="text-black font-semibold text-3xl w-[500px]">
            <TextGenerateEffect words={h1} />
          </h1>
          <p>Hello! I'm Kiran, a fine art artist.</p>

          <p className="">Scroll down to see art made by me :)</p>
        </div>
        <div>
          <img
            src="./cover.webp"
            alt="krian smiling"
            className="object-cover "
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
