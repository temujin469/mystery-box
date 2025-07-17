"use client";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { motion } from "framer-motion";

type Props = {};

export function PromoBanner({}: Props) {
  return (
    <div className="moving-bg relative w-full flex bg-primary/10 overflow-hidden rounded-lg p-8 py-12 bg-[url('/img/inspiration-geometry.png')] mb-10">
        <div className="absolute left-[-50%] top-[-50%] h-[600px] w-[80%] bg-[#0E1F34] blur-3xl"></div>
      <div className="w-full z-[10]">
        <h1 className="text-2xl md:text-4xl font-bold mb-8">
          <span className="text-primary">Нууцлаг хайрцаг</span> нээж,
          <br /> Бүтээгдэхүүн хожоорой
        </h1>
        <p className="mb-7 text-gray-300 text-sm md:text-md">
          Ил тод, шударга бөгөөд хайрцаг нээх бүрт нэмэлт урамшуулалтай <br className="hidden sm:block"/>{" "}
          азын хүрд эргэсний дараа хэн ч хоосон үлддэггүй
        </p>
        <Button size="lg">Бүртгүүлэх</Button>
      </div>

      <div className="relative sm:w-full">
        <motion.div
          animate={{
            opacity: [0.3, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
          style={{
            display: "inline-block",
          }}
          className="h-50 w-50 rounded-full blur-3xl bg-primary absolute bottom-[-100px] md:top-[35%] right-[-60px] md:right-[150px]"
        ></motion.div>

        <div className="hidden sm:block">
          {/* floating item ==================== */}
          <motion.div
            animate={{
              y: [0, -15, 0], // Float up, back to center, down, and back
              rotate: [0, 1, 0], // Sway rotation gently
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
            style={{
              display: "inline-block",
            }}
            className="h-50 w-50 absolute top-[-70px] right-0"
          >
            <Image
              src="/img/banner/floating1.webp"
              width={130}
              height={130}
              alt="banner"
            />
          </motion.div>

          {/* boxes =========================*/}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              y: [300, 0],
              opacity: 1,
            }}
            transition={{
              duration: 0.5,
              delay: 0.1,
            }}
            className="h-50 w-50 absolute top-15 right-[300px] hidden xl:block"
          >
            <Image
              src="/img/banner/box3.webp"
              width={200}
              height={200}
              alt="banner"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              y: [300, 0],
              opacity: 1,
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
            className="z-10 w-70 h-70 absolute top-0 right-[100px] hidden md:block"
          >
            <Image
              src="/img/banner/box1.webp"
              width={250}
              height={250}
              alt="banner"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              y: [300, 0],
              opacity: 1,
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
              delay: 0.09,
            }}
            className=" w-50 h-50 absolute top-15 right-0"
          >
            <Image
              src="/img/banner/box2.webp"
              width={200}
              height={200}
              alt="banner"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default PromoBanner;
