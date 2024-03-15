"use client";

import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";

const Page = () => {
  const [classes, setClasses] = useState([]);

  const getClasses = async () => {
    const querySnapshot = await getDocs(collection(db, "classes"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setClasses(data);
  };

  useEffect(() => {
    getClasses();
  }, []);

  return (
    <div className="h-auto w-full pt-14 px-28">
      <div className="flex flex-col items-center w-full p-4">
        <h1 className="text-4xl font-bold text-gray-800 pb-6">Classes</h1>
        <p className=" text-gray-600 pb-8 text-center">
          {classes[0]?.classInfo.description}
        </p>

        <div className="flex flex-col w-full gap-2">
          {classes[0]?.classes.map((classItem, index) => (
            <ClassSchedule
              key={index}
              day={classItem.day}
              time={classItem.time}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ClassSchedule = ({ day, time }) => (
  <div className="p-4 flex flex-col items-center">
    <h2 className="text-2xl font-bold text-gray-800">{day}</h2>
    <p className="text-lg text-gray-600">{time}</p>
  </div>
);

export default Page;
