"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { FiUpload, FiX } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";
import imageCompression from "browser-image-compression";

const CommissionPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    commissionType: "",
    deadline: "",
    budget: "",
  });

  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const commissionTypes = [
    "Digital Art",
    "Traditional Art",
    "Portrait",
    "Sketch",
    "Other",
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error("Error compressing image:", error);
      return file;
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const processFiles = async (files) => {
    if (images.length + files.length > 5) {
      toast.error("Maximum 5 images allowed", {
        position: "bottom-right",
      });
      return;
    }

    // Filter for image files only
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length !== files.length) {
      toast.error("Some files were not images and were rejected.", {
        position: "bottom-right",
      });
    }

    // Show loading toast for compression
    const loadingToast = toast.loading("Processing images...", {
      position: "bottom-right",
    });

    try {
      const processedImages = await Promise.all(
        imageFiles.map(async (file) => {
          let processedFile = file;

          // Only compress if file is larger than 5MB
          if (file.size > 5 * 1024 * 1024) {
            processedFile = await compressImage(file);
            toast.info(
              `Compressed ${file.name} from ${(file.size / 1024 / 1024).toFixed(
                2
              )}MB to ${(processedFile.size / 1024 / 1024).toFixed(2)}MB`,
              {
                position: "bottom-right",
              }
            );
          }

          return {
            file: processedFile,
            preview: URL.createObjectURL(processedFile),
            name: file.name,
            size: (processedFile.size / 1024 / 1024).toFixed(2), // Size in MB
            originalSize: (file.size / 1024 / 1024).toFixed(2), // Original size in MB
          };
        })
      );

      setImages((prev) => [...prev, ...processedImages]);
      toast.success(
        `${processedImages.length} image${
          processedImages.length !== 1 ? "s" : ""
        } processed successfully!`,
        {
          position: "bottom-right",
        }
      );
    } catch (error) {
      console.error("Error processing images:", error);
      toast.error("Error processing some images", {
        position: "bottom-right",
      });
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
    toast.info("Image removed", {
      position: "bottom-right",
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    images.forEach((image, index) => {
      formDataToSend.append(`image-${index}`, image.file);
    });

    try {
      const response = await fetch("/api/commission", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        toast.success("Commission request sent successfully!", {
          position: "bottom-right",
        });
        setFormData({
          name: "",
          email: "",
          message: "",
          commissionType: "",
          deadline: "",
          budget: "",
        });
        setImages([]);
      } else {
        toast.error(data.error || "Failed to send request.", {
          position: "bottom-right",
        });
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to send request.", {
        position: "bottom-right",
      });
      setStatus("error");
      setErrorMessage("Failed to send message");
    } finally {
      setStatus("idle");
    }
  };

  const ImagePreview = ({ image, index }) => (
    <div className="relative group bg-gray-50 p-2 rounded-lg border border-gray-200">
      <div className="relative pt-[75%]">
        <img
          src={image.preview}
          alt={`Reference ${index + 1}`}
          className="absolute inset-0 w-full h-full object-cover rounded-md"
        />
        <button
          type="button"
          onClick={() => removeImage(index)}
          className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        <p className="truncate">{image.name}</p>
        <p>{image.size} MB</p>
        {image.originalSize !== image.size && (
          <p className="text-green-600">
            Compressed from {image.originalSize} MB
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg p-6 md:p-8">
          <h1 className="text-3xl font-semibold text-center mb-2">
            Art Commission Request
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Fill out the form below to request a commission. I'll get back to
            you with a quote.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Commission Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="commissionType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Commission Type
                </label>
                <select
                  id="commissionType"
                  name="commissionType"
                  value={formData.commissionType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Type</option>
                  {commissionTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="budget"
                  className="block text-sm font-medium text-gray-700"
                >
                  Budget (AUD)
                </label>
                <input
                  id="budget"
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="deadline"
                className="block text-sm font-medium text-gray-700"
              >
                Preferred Deadline
              </label>
              <input
                id="deadline"
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Project Details
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="Please describe your commission request in detail..."
              />
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reference Images
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                  isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  max="5"
                />
                <label
                  htmlFor="images"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FiUpload className="w-8 h-8 text-gray-500" />
                    <span className="text-sm text-gray-500 text-center">
                      Drop images here or click to upload
                      <br />
                      <span className="text-xs text-gray-400">
                        (Max 5 images, 5MB each)
                      </span>
                    </span>
                  </div>
                </label>
              </div>

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-3">
                    Uploaded Images ({images.length}/5)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <ImagePreview key={index} image={image} index={index} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="text-red-500 text-sm">{errorMessage}</div>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className={`w-full py-3 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors
                ${status === "sending" ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              {status === "sending"
                ? "Sending..."
                : "Submit Commission Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommissionPage;
