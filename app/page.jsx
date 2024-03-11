"use client";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

const Home = () => {
  const h1 = "Artist from Nepal";

  return (
    <div className="flex max-sm:flex-col-reverse justify-center lg:px-28">
      <div className="w-full  pt-10 pb-24 bg-pink-100 flex flex-col items-center justify-center">
        <div className="w-4/5   sm:w-[400px] p-4">
          <h1 className="text-2xl text-right">
            <TextGenerateEffect words={h1} />
          </h1>
          <p className="pt-2 text-justify hyphens-auto">
            Hi, I'm Kiran! I'm deeply passionate about art, especially painting,
            and I love sharing that passion through teaching. Painting allows me
            to express myself in beautiful and meaningful ways, experimenting
            with colors, shapes, and textures. As an art teacher, I find immense
            joy in guiding others on their creative journey, helping them
            develop their skills and find their artistic voice.
          </p>
        </div>
      </div>
      <img
        src="./homecover.webp"
        alt="krian smiling"
        className=" object-cover max-sm:min-h-[300px]"
      />
    </div>
  );
};

export default Home;
