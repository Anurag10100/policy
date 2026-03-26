import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Verticals } from "@/components/Verticals";
import { HowItWorks } from "@/components/HowItWorks";
import { Pricing } from "@/components/Pricing";
import { SubscribeForm } from "@/components/SubscribeForm";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Verticals />
      <HowItWorks />
      <Pricing />
      <section id="subscribe" className="py-20 px-6 bg-[var(--color-primary)]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Get Started Today
          </h2>
          <p className="text-blue-200 mb-8">
            Join as a founding subscriber and get early access to India&apos;s
            most comprehensive policy intelligence platform.
          </p>
          <SubscribeForm />
        </div>
      </section>
      <Footer />
    </main>
  );
}
