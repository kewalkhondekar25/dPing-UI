import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-32 relative overflow-hidden bg-background">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-solana-purple/10 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-solana-blue/20 rounded-full mix-blend-screen filter blur-[150px] -z-10 animate-blob"></div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-[1.1]">
            Own Your Attention. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-solana-purple via-solana-blue to-solana-green">
              Monetize Your Access.
            </span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Join the decentralized creator economy on Solana. Stop giving away your time for free and start connecting meaningfully.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto rounded-full h-14 px-10 bg-white text-black hover:bg-white/90 font-semibold text-lg shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] transition-all duration-300">
              Launch App
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
