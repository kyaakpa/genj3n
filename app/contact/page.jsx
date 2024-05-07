// ContactPage.jsx
import React from "react";

const ContactPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 flex-grow">
      <div className="flex flex-col items-center h-full">
        <h1 className="text-4xl pb-12">Contact Me</h1>
        <p className="text-sm pb-16">
          Please fill the form below or email me at{" "}
          <a href="mailto:" className="underline text-[#c5a365]">
            phurpalama@gmail.com
          </a>{" "}
          and I will get back to you as soon as possible.
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
            className="border border-gray-400 py-2 px-4 active:outline-none focus:outline-none"
          />
          <textarea
            placeholder="Message"
            className="border border-gray-400 py-2 px-4 active:outline-none focus:outline-none"
            rows={5}
          />
        </div>
        <button
          className="bg-black text-white p-4 w-1/3 active:outline-none text-sm"
          type="submit"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ContactPage;
