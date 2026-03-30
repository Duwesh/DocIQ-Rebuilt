"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { HeroBackground } from "./hero-background";

export function HeroSection({ userId }: { userId: string | null }) {
  return (
    <section className="relative py-14 text-center border-b border-white/5 overflow-hidden">
      <HeroBackground />

      <div className="container max-w-5xl mx-auto px-6 relative z-10">
        <motion.h1
          className="text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-4 text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          AI-powered document workflows for{" "}
          <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            modern teams
          </span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
        >
          Analyze, extract insights, and collaborate on documents at scale.
          Built for teams that move fast.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
        >
          {userId ? (
            <Link href="/dashboard">
              <Button
                size="lg"
                className="px-10 h-14 text-lg flex items-center gap-2 group shadow-lg hover:shadow-xl transition-all"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="px-10 h-14 text-lg group shadow-lg hover:shadow-xl transition-all"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>

              <Link href="/sign-in">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-10 h-14 text-lg border-white/10 text-gray-300 hover:bg-white/5"
                >
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </motion.div>

        <motion.p
          className="text-sm text-gray-500 mt-10 pb-2 font-medium uppercase tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          Trusted by the world&apos;s most innovative teams
        </motion.p>
      </div>
    </section>
  );
}
