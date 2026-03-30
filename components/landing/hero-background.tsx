"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Search,
  Brain,
  Sparkles,
  BarChart3,
  ScanText,
} from "lucide-react";

const floatingItems = [
  { Icon: FileText, size: 28, x: "8%", y: "15%", delay: 0, opacity: 0.15 },
  { Icon: FileText, size: 22, x: "85%", y: "20%", delay: 0.5, opacity: 0.12 },
  { Icon: FileText, size: 32, x: "75%", y: "70%", delay: 1, opacity: 0.1 },
  { Icon: FileText, size: 20, x: "15%", y: "75%", delay: 1.5, opacity: 0.12 },
  { Icon: Brain, size: 26, x: "92%", y: "45%", delay: 0.3, opacity: 0.12 },
  { Icon: Sparkles, size: 18, x: "5%", y: "50%", delay: 0.8, opacity: 0.15 },
  { Icon: Search, size: 22, x: "70%", y: "10%", delay: 0.6, opacity: 0.11 },
  { Icon: ScanText, size: 24, x: "25%", y: "85%", delay: 1.2, opacity: 0.12 },
  { Icon: BarChart3, size: 20, x: "50%", y: "8%", delay: 0.2, opacity: 0.1 },
  { Icon: Sparkles, size: 16, x: "40%", y: "90%", delay: 1.4, opacity: 0.12 },
];

const blobVariants = {
  animate: (i: number) => ({
    x: [0, 30, -20, 0],
    y: [0, -25, 15, 0],
    scale: [1, 1.08, 0.95, 1],
    transition: {
      duration: 14 + i * 2,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  }),
};

export function HeroBackground() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Animated glow blobs */}
      <motion.div
        className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        custom={0}
        variants={blobVariants}
        animate="animate"
      />
      <motion.div
        className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"
        custom={1}
        variants={blobVariants}
        animate="animate"
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-500/15 rounded-full blur-3xl"
        custom={2}
        variants={blobVariants}
        animate="animate"
      />

      {/* Scanning line */}
      <motion.div
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"
        animate={{ top: ["-2%", "102%"] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 1.5,
        }}
      />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.06)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Floating icons */}
      {floatingItems.map((item, i) => (
        <motion.div
          key={i}
          className="absolute text-blue-400"
          style={{ left: item.x, top: item.y }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{
            opacity: item.opacity,
            scale: 1,
            y: [0, -14, -6, -20, 0],
            rotate: [0, 4, -3, 2, 0],
          }}
          transition={{
            opacity: { duration: 1, delay: item.delay },
            scale: { duration: 1, delay: item.delay },
            y: {
              duration: 16 + i * 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: item.delay,
            },
            rotate: {
              duration: 18 + i * 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: item.delay,
            },
          }}
        >
          <item.Icon size={item.size} strokeWidth={1.5} />
        </motion.div>
      ))}

      {/* Animated connecting lines */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {[
          { x1: "10%", y1: "20%", x2: "30%", y2: "45%", delay: 0 },
          { x1: "70%", y1: "15%", x2: "90%", y2: "50%", delay: 0.5 },
          { x1: "20%", y1: "80%", x2: "50%", y2: "60%", delay: 1 },
          { x1: "55%", y1: "10%", x2: "75%", y2: "35%", delay: 1.5 },
        ].map((line, i) => (
          <motion.line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            className="stroke-blue-400/15"
            strokeWidth="1"
            strokeDasharray="4 8"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: 1,
              strokeDashoffset: [0, -48],
            }}
            transition={{
              pathLength: { duration: 1.5, delay: line.delay + 0.5 },
              opacity: { duration: 0.8, delay: line.delay + 0.5 },
              strokeDashoffset: {
                duration: 6,
                repeat: Infinity,
                ease: "linear",
                delay: line.delay + 2,
              },
            }}
          />
        ))}
      </svg>

      {/* Particle dots drifting upward */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full bg-blue-400/30"
          style={{ left: `${12 + i * 11}%`, bottom: "0%" }}
          animate={{
            y: [0, -400, -600],
            opacity: [0, 0.6, 0],
            x: [0, (i % 2 === 0 ? 1 : -1) * 20],
          }}
          transition={{
            duration: 8 + i * 1.2,
            repeat: Infinity,
            delay: i * 0.9,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
