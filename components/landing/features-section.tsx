"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { features } from "@/app/data/data";
import { motion } from "framer-motion";

export function FeaturesSection() {
  return (
    <section className="py-14">
      <div className="container max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
            Everything you need to work with documents
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            From ingestion to insights — a complete AI-powered workflow designed
            for high-performance teams.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
            >
              <Card className="glass-card h-full">
                <CardHeader>
                  <motion.div
                    className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-lg mb-3 w-fit"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <feature.icon className="w-6 h-6 text-blue-400" />
                  </motion.div>
                  <CardTitle className="text-lg text-white">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-400">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
