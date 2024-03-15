"use client";

import AdminLayout from "@/app/admin-layout";
import { db } from "@/app/firebase/config";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const router = useRouter();
  const [classData, setClassData] = useState({ classInfo: {}, classes: [] });
  const [isCreating, setIsCreating] = useState(false);
  const [newClass, setNewClass] = useState({
    day: "",
    time: "",
    id: Math.random().toString(36).substring(7),
  });
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [isEditing, setIsEditing] = useState({});

  const getClasses = async () => {
    const querySnapshot = await getDocs(collection(db, "classes"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const classInfo = data[0] || { id: "", classes: [], classInfo: {} };
    setClassData(classInfo);
    setEditedDescription(classInfo.classInfo.description);
  };

  const handleCreateClass = async () => {
    await setDoc(doc(db, "classes", classData.id), {
      ...classData,
      classes: [...classData.classes, newClass],
    });

    toast.success("Class created successfully!");
    setClassData((prevData) => ({
      ...prevData,
      classes: [...prevData.classes, newClass],
    }));
    setNewClass({ day: "", time: "" });
    setIsCreating((prevState) => !prevState);
  };

  const handleInputChange = (e) => {
    setNewClass({ ...newClass, [e.target.name]: e.target.value });
  };

  const handleEditClass = (classId) => {
    setIsEditing((prevState) => ({
      ...prevState,
      [classId]: !prevState[classId],
    }));
  };

  const handleSaveClass = async (classId, index) => {
    try {
      const updatedClasses = [...classData.classes];
      updatedClasses[index] = { ...updatedClasses[index], ...newClass };

      await setDoc(doc(db, "classes", classData.id), {
        ...classData,
        classes: updatedClasses,
      });

      setClassData((prevData) => ({
        ...prevData,
        classes: updatedClasses,
      }));

      toast.success("Class updated successfully!");
      setIsEditing({ ...isEditing, [classId]: false });
      setNewClass({ day: "", time: "" });
    } catch (e) {
      console.error("Error updating class: ", e);
    }
  };

  const handleDeleteClass = async (id) => {
    try {
      console.log("Deleting class with id: ", id);

      const updatedClasses = classData.classes.filter((cls) => cls.id !== id);

      await setDoc(doc(db, "classes", classData.id), {
        ...classData,
        classes: updatedClasses,
      });

      toast.success("Class deleted successfully!");

      setClassData((prevData) => ({
        ...prevData,
        classes: updatedClasses,
      }));
    } catch (e) {
      console.error("Error removing document: ", e);
    }
  };

  const handleEditDescription = () => {
    setIsEditingDescription(true);
  };

  const handleSaveDescription = async () => {
    try {
      await setDoc(doc(db, "classes", classData.id), {
        ...classData,
        classInfo: { description: editedDescription },
      });

      toast.success("Class description updated successfully!");
      setIsEditingDescription(false);
    } catch (e) {
      console.error("Error updating class description: ", e);
    }
  };

  useEffect(() => {
    getClasses();
  }, []);

  return (
    <AdminLayout>
      <div className="flex items-start h-screen">
        <div className="w-full">
          <div className="flex flex-col items-start">
            <div className="flex flex-row justify-between w-full gap-4 pb-6 pt-4 text-sm">
              <h1 className="text-4xl">Classes</h1>
              <div
                className="flex flex-row items-center gap-4 bg-black text-white p-4 hover: cursor-pointer duration-300 ease-in-out "
                onClick={() => setIsCreating((prevState) => !prevState)}
              >
                <FaPlus />
                <button className="w-full active:outline-none text-sm">
                  Create Class
                </button>
              </div>
            </div>
            <div className="flex flex-row items-start w-full">
              <div className="flex flex-col w-full ">
                <div className="flex flex-row py-4 px-6 w-full bg-blue-100 mb-4">
                  <div className="flex flex-col w-2/3">
                    <h3 className="text-lg font-semibold">Class Description</h3>
                    {isEditingDescription ? (
                      <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className="border border-gray-400 p-2 w-full"
                      ></textarea>
                    ) : (
                      <p className="text-sm text-gray-600">
                        {editedDescription}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-auto ">
                    {isEditingDescription ? (
                      <>
                        <button
                          className="bg-red-500 text-white my-8 px-4 py-2  rounded-md flex items-center"
                          onClick={() => setIsEditingDescription(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="bg-blue-500 text-white my-8 px-4 py-2  rounded-md"
                          onClick={handleSaveDescription}
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <button
                        className="bg-blue-500 text-white my-2 px-4 rounded-md"
                        onClick={handleEditDescription}
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
                <div className="w-full">
                  {classData.classes.map((cls, index) => (
                    <>
                      <div
                        key={cls.id}
                        className={`flex items-center justify-between py-4 px-6 ${
                          index % 2 === 0 ? "bg-gray-100" : "bg-white"
                        }`}
                      >
                        {isEditing[cls.id] ? (
                          <div className="flex items-center justify-between w-full">
                            <div className="flex gap-4">
                              <input
                                type="text"
                                name="day"
                                value={newClass.day}
                                onChange={handleInputChange}
                                placeholder="Enter class day"
                                className="border border-gray-400 py-2 px-4"
                              />
                              <input
                                type="text"
                                name="time"
                                value={newClass.time}
                                onChange={handleInputChange}
                                placeholder="Enter class time"
                                className="border border-gray-400 py-2 px-4"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                onClick={() => handleSaveClass(cls.id, index)}
                              >
                                Save
                              </button>
                              <button
                                className="bg-red-500 text-white px-4 py-2 rounded-md"
                                onClick={() =>
                                  setIsEditing({ [cls.id]: false })
                                }
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div>
                              <h3 className="text-lg font-semibold">
                                {cls.day}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {cls.time}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                onClick={() => handleEditClass(cls.id)}
                              >
                                Edit
                              </button>
                              <button
                                className="bg-red-500 text-white px-4 py-2 rounded-md"
                                onClick={() => handleDeleteClass(cls.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  ))}
                  {isCreating && (
                    <div className="flex items-center justify-between py-4 px-6 bg-white">
                      <div className="flex gap-4">
                        <input
                          type="text"
                          name="day"
                          value={newClass.day}
                          onChange={handleInputChange}
                          placeholder="Enter class day"
                          className="border border-gray-400 py-2 px-4"
                        />
                        <input
                          type="text"
                          name="time"
                          value={newClass.time}
                          onChange={handleInputChange}
                          placeholder="Enter class time"
                          className="border border-gray-400 py-2 px-4"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded-md"
                          onClick={handleCreateClass}
                        >
                          Save
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded-md"
                          onClick={() => setIsCreating(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Page;
