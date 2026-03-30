"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function CtaSection() {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20" />
      <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-3xl" />

      <div className="container max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-tight text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          Ready to transform your document workflow?
        </motion.h2>

        <motion.p
          className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Start analyzing documents with AI in seconds. Join hundreds of
          high-performing teams moving faster with DocIQ.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link href="/sign-up">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="lg"
                className="px-12 h-16 text-xl group rounded-full font-bold shadow-2xl shadow-blue-500/20 transition-colors"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        <motion.p
          className="text-gray-500 mt-8 font-medium text-sm lg:text-base"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          No credit card required • Cancel anytime • 100% Secure
        </motion.p>
      </div>
    </section>
  );
}
