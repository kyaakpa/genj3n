"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        toast.success("Message sent.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error("Something went wrong.");
        setStatus("error");

        setErrorMessage(data.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong.");
      setStatus("error");
      setErrorMessage("Failed to send message");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex-grow">
      <div className="flex flex-col items-center h-full">
        <h1 className="text-4xl pb-12">Contact Me</h1>
        <p className="text-sm pb-16">
          Please fill the form below or email me at{" "}
          <a
            href="mailto:phurpalama@gmail.com"
            className="underline text-[#c5a365]"
          >
            phurpalama@gmail.com
          </a>{" "}
          and I will get back to you as soon as possible.
        </p>
        <form onSubmit={handleSubmit} className="w-full max-w-lg">
          <div className="flex flex-col w-full gap-4 pb-6 text-sm">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="border border-gray-400 py-2 px-4 active:outline-none focus:outline-none"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-400 py-2 px-4 active:outline-none focus:outline-none"
              required
            />
            <textarea
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
              className="border border-gray-400 py-2 px-4 active:outline-none focus:outline-none"
              rows={5}
              required
            />
          </div>
          <button
            className={`bg-black text-white p-4 w-full active:outline-none text-sm ${
              status === "sending" ? "opacity-50 cursor-not-allowed" : ""
            }`}
            type="submit"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
