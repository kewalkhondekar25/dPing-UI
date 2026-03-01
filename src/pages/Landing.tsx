import { Header } from "../components/landing/Header";
import { Hero } from "../components/landing/Hero";
import { Problem } from "../components/landing/Problem";
import { Solution } from "../components/landing/Solution";
import { HowItWorks } from "../components/landing/HowItWorks";
import { Features } from "../components/landing/Features";
import { SplitSection } from "../components/landing/SplitSection";
import { FAQ } from "../components/landing/FAQ";
import { CTA } from "../components/landing/CTA";
import { Footer } from "../components/landing/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-solana-purple/30">
      <Header />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <HowItWorks />
        <Features />
        <SplitSection />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
