"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const Home = () => {
  // Variants for parent container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  // Variants for heading
  const headingVariants = {
    hidden: {
      y: 20,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  // Variants for text
  const textVariants = {
    hidden: {
      y: 20,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="flex flex-col justify-end items-center lg:pt-12 max-lg:pt-16">
      <div className="flex max-sm:flex-col justify-between items-end p-4">
        <motion.div
          className="p-10 w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-6xl font-light pb-6"
            variants={headingVariants}
          >
            Hi, I am Genjen Lama
          </motion.h1>
          <motion.p
            className="text-lg leading-relaxed max-w-2xl"
            variants={textVariants}
          >
            I am an abstract expressionist artist who transforms emotions into
            digital art. Through bold strokes and dynamic colors on my tablet, I
            create pieces that speak to the raw, authentic experiences of being
            human. My work is deeply personal yet universally relatable – each
            digital artwork a conversation between spontaneity and intention.
          </motion.p>
        </motion.div>

        <motion.div
          className="px-4 lg:w-[800px]"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Image
            src="/home7.png"
            alt="self portrait"
            width={300}
            height={300}
            className="w-full h-full"
            loading="lazy"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
