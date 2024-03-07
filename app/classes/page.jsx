import React from "react";

const Page = () => {
  return (
    <div className="h-auto w-full pt-14 px-28 ">
      <div className="flex flex-col items-center w-full p-8">
        <h1 className="text-4xl font-bold text-gray-800 pb-6">Classes</h1>
        <p className="text-sm text-gray-600 pb-8 text-center">
          I offer classes for all ages. Please fill the form below or email me
          at{" "}
          <a href="mailto:" className="underline text-indigo-600">
            kiranpaintings@gmail.com
          </a>{" "}
          and I will get back to you as soon as possible.
        </p>

        <div className="flex flex-col w-full">
          <ClassSchedule day="Monday - Friday" time="4:30pm - 6:00pm" />
          <ClassSchedule day="Saturday" time="4:30pm - 6:00pm" />
          <ClassSchedule day="Sunday" time="4:30pm - 6:00pm" />
        </div>
      </div>
    </div>
  );
};

const ClassSchedule = ({ day, time }) => (
  <div className="p-4 flex flex-col items-center">
    <h2 className="text-xl font-bold text-gray-800">{day}</h2>
    <p className="text-lg text-gray-600">{time}</p>
  </div>
);

export default Page;
