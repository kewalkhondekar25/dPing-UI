import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/60 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-solana-purple to-solana-green flex items-center justify-center">
            <span className="text-white font-bold text-lg leading-none">d</span>
          </div>
          <span className="text-xl font-bold tracking-tight">dPing</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
          <a href="#creators" className="hover:text-foreground transition-colors">For Creators</a>
          <a href="#fans" className="hover:text-foreground transition-colors">For Fans</a>
          <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-4">
          <Button className="bg-white text-black hover:bg-white/90 rounded-full font-semibold px-6">
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </Button>
        </div>
      </div>
    </header>
  );
}
