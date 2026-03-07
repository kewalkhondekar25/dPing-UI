import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Play, ShieldCheck, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 w-full h-full bg-background overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-solana-purple/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-solana-green/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-solana-blue/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000"></div>
        
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-muted-foreground mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-solana-green"></span>
          Built on Solana
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 max-w-4xl mx-auto leading-[1.1]"
        >
          Connect with Creators. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-solana-purple via-solana-blue to-solana-green">
            On-Chain. No Spam.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          dPing is a decentralized platform where audiences connect with their favorite creators by paying in SOL. Genuine interactions, instant access, zero noise.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/register">
            <Button size="lg" className="w-full sm:w-auto rounded-full h-12 px-8 bg-white text-black hover:bg-white/90 font-semibold text-base">
              Start Connecting
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <a href="https://res.cloudinary.com/kewalkhondekar/video/upload/v1772878811/dPing/demo_with_voice_bmhyxh.mp4" target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full h-12 px-8 border-white/10 hover:bg-white/5 font-semibold text-base">
              <Play className="mr-2 w-4 h-4" />
              Watch Demo
            </Button>
          </a>
        </motion.div>

        {/* Stats/Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto border-t border-white/10 pt-10"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-solana-purple/10 flex items-center justify-center text-solana-purple mb-2">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-foreground">Spam-Free</h3>
            <p className="text-sm text-muted-foreground">Pay-to-ping eliminates noise</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-solana-green/10 flex items-center justify-center text-solana-green mb-2">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-foreground">Instant Unlock</h3>
            <p className="text-sm text-muted-foreground">On-chain verification in ms</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-solana-blue/10 flex items-center justify-center text-solana-blue mb-2">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-foreground">1:1 Access</h3>
            <p className="text-sm text-muted-foreground">Direct chat with creators</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
