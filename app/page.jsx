"use client";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

const Home = () => {
  const h1 = `Fashion & Lifestyle Illustration. Hello! I'm Kiran, a fine art artist.`;
  return (
    <div className="flex justify-center flex-col">
      <div className="h-[25vh] bg-red-100 flex flex-col items-center justify-center">
        <h1>
          <TextGenerateEffect words={h1} />
        </h1>
      </div>
      <img src="./cover.webp" alt="krian smiling" className="object-cover " />
    </div>
  );
};

export default Home;
