"use client";

import { stats } from "@/app/data/data";
import { motion } from "framer-motion";

export function StatsSection() {
  return (
    <section className="py-14">
      <div className="container max-w-5xl mx-auto px-6 text-center">
        <div className="grid md:grid-cols-3 gap-10">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.12,
                ease: "easeOut",
              }}
            >
              <motion.h3
                className="text-5xl font-extrabold text-white mb-2 tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.6,
                  delay: 0.1 + index * 0.12,
                }}
              >
                {stat.value}
              </motion.h3>
              <p className="text-gray-400 font-semibold text-lg">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
