"use client";

import { steps } from "@/app/data/data";
import { motion } from "framer-motion";

export function HowItWorksSection() {
  return (
    <section className="py-14 bg-white/[0.02] border-y border-white/5">
      <div className="container max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
            How it works
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Get up and running in minutes. Simple, linear, and powerful.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 relative pt-8">
          {/* Animated connecting line */}
          <motion.div
            className="hidden md:block absolute top-[40px] left-[50px] right-[50px] h-0.5 bg-blue-500/20 z-0 origin-left"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center gap-4 relative z-10 flex-1 md:px-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.5,
                delay: 0.2 + index * 0.15,
                ease: "easeOut",
              }}
            >
              <motion.div
                className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xl shadow-xl shadow-blue-500/20 ring-4 ring-blue-500/10"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 15,
                  delay: 0.3 + index * 0.15,
                }}
              >
                {index + 1}
              </motion.div>
              <h3 className="text-lg font-bold text-gray-100 leading-tight max-w-[200px]">
                {step}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
