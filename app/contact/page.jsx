import React from "react";

const page = () => {
  return (
    <div className="h-auto w-full  pt-14 px-28">
      <div className="flex flex-col items-center w-full">
        <h1 className="text-4xl pb-12">Contact Me</h1>
        <p className="text-sm pb-16">
          Please fill the form below or email me at{" "}
          <a href="mailto:" className="underline">
            kiranpaintings@gmail.com
          </a>
          {""} and I will get back to you as soon as possible.
        </p>
        <div className="flex flex-col w-1/3 gap-4 pb-6 text-sm">
          <input
            type="text"
            placeholder="Name"
            className="border border-gray-400 py-2 px-4 active:outline-none focus:outline-none"
          />
          <input
            type="text"
            placeholder="Email"
            className="  border border-gray-400 py-2 px-4 active:outline-none focus:outline-none"
          />
          <textarea
            placeholder="Message"
            className="border border-gray-400 py-2 px-4 active:outline-none focus:outline-none"
            rows={5}
          />
        </div>
        <button
          className="bg-black text-white p-4 w-1/3 active:outline-none text-sm mb-20"
          type="submit"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default page;
