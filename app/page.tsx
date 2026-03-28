import { Button } from "@/components/ui/button";
import { features, steps } from "./data/data";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { CheckCircle, ArrowRight } from "lucide-react";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="flex flex-col">
      {/* ================= HERO ================= */}
      <section className="py-20 text-center bg-linear-to-b from-white to-gray-50 border-b border-gray-100">
        <div className="container max-w-5xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
            AI-powered document workflows for{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              modern teams
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Analyze, extract insights, and collaborate on documents at scale.
            Built for teams that move fast.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {userId ? (
              <Link href="/dashboard">
                <Button size="lg" className="px-10 h-14 text-lg flex items-center gap-2 group shadow-lg hover:shadow-xl transition-all">
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-up">
                  <Button size="lg" className="px-10 h-14 text-lg group shadow-lg hover:shadow-xl transition-all">
                    Start Free Trial
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>

                <Link href="/sign-in">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-10 h-14 text-lg border-2"
                  >
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>

          <p className="text-sm text-gray-400 mt-16 pb-4 font-medium uppercase tracking-widest">
            Trusted by the world's most innovative teams
          </p>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-24">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to work with documents
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              From ingestion to insights — a complete AI-powered workflow designed for high-performance teams.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-lg mb-4 w-fit">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Get up and running in minutes. Simple, linear, and powerful.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 relative pt-10">
             {/* Desktop connecting line */}
             <div className="hidden md:block absolute top-[44px] left-[50px] right-[50px] h-0.5 bg-blue-100 z-0" />
             
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center gap-6 relative z-10 flex-1 md:px-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-2xl shadow-xl ring-8 ring-white">
                  {index + 1}
                </div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight max-w-[200px]">
                  {step}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= STATS / TRUST ================= */}
      <section className="py-24">
        <div className="container max-w-5xl mx-auto px-6 text-center">
          <div className="grid md:grid-cols-3 gap-16">
            <div>
              <h3 className="text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">10k+</h3>
              <p className="text-gray-500 font-semibold text-lg">Documents processed</p>
            </div>
            <div>
              <h3 className="text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">99.9%</h3>
              <p className="text-gray-500 font-semibold text-lg">Accuracy rate</p>
            </div>
            <div>
              <h3 className="text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">5x</h3>
              <p className="text-gray-500 font-semibold text-lg">Faster workflows</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 bg-linear-to-r from-blue-700 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-3xl" />
        <div className="container max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
            Ready to transform your document workflow?
          </h2>

          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            Start analyzing documents with AI in seconds. Join hundreds of high-performing teams moving faster with DocIQ.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/sign-up">
              <Button
                size="lg"
                className="px-12 h-16 text-xl bg-white text-blue-700 hover:bg-gray-50 group rounded-full font-bold shadow-2xl transition-all hover:scale-105 active:scale-95"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <p className="text-blue-100/60 mt-10 font-medium text-sm lg:text-base">
            No credit card required • Cancel anytime • 100% Secure
          </p>
        </div>
      </section>
    </div>
  );
}
