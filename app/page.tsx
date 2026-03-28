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
      <section className="py-24 text-center bg-gradient-to-b from-white to-gray-50">
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

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {userId ? (
              <Link href="/dashboard">
                <Button size="lg" className="px-10 h-12 text-base flex items-center gap-2">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-up">
                  <Button size="lg" className="px-10 h-12 text-base">
                    Start Free Trial
                  </Button>
                </Link>

                <Link href="/sign-in">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-10 h-12 text-base"
                  >
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* subtle trust line */}
          <p className="text-sm text-gray-500 mt-6">
            Trusted by teams across startups and enterprises
          </p>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-semibold mb-3">
              Everything you need to work with documents
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              From ingestion to insights — a complete AI-powered workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border border-gray-100 shadow-sm hover:shadow-md transition"
              >
                <CardHeader>
                  <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-lg mb-4">
                    <feature.icon className="w-7 h-7 text-blue-600" />
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
      <section className="py-20 bg-gray-50">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-2">How it works</h2>
            <p className="text-gray-600">Get started in minutes, not hours.</p>
          </div>

          <div className="space-y-5">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-xl shadow-sm"
              >
                <div className="shrink-0 h-9 w-9 bg-blue-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>

                <span className="text-gray-800 font-medium">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= STATS / TRUST ================= */}
      <section className="py-20">
        <div className="container max-w-5xl mx-auto px-6 text-center">
          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <h3 className="text-3xl font-bold">10k+</h3>
              <p className="text-gray-600">Documents processed</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold">99.9%</h3>
              <p className="text-gray-600">Accuracy rate</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold">5x</h3>
              <p className="text-gray-600">Faster workflows</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Ready to transform your document workflow?
          </h2>

          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Start analyzing documents with AI in seconds. No setup required.
          </p>

          <Link href="/sign-up">
            <Button
              size="lg"
              className="px-10 h-12 bg-white text-blue-600 hover:bg-gray-100"
            >
              Get Started Free
            </Button>
          </Link>

          <p className="text-sm text-blue-100 mt-4">
            No credit card required • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
}
