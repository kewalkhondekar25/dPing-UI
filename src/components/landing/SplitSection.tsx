import { motion } from "motion/react";
import { CheckCircle2, Star, ShieldCheck, Zap, Heart, Coins } from "lucide-react";

export function SplitSection() {
  const creatorBenefits = [
    { icon: <ShieldCheck className="w-5 h-5 text-solana-purple" />, text: "Zero spam, 100% signal" },
    { icon: <Coins className="w-5 h-5 text-solana-purple" />, text: "Keep 95%+ of your earnings" },
    { icon: <Zap className="w-5 h-5 text-solana-purple" />, text: "Instant payouts in SOL" },
    { icon: <CheckCircle2 className="w-5 h-5 text-solana-purple" />, text: "Full control over pricing" }
  ];

  const fanBenefits = [
    { icon: <Star className="w-5 h-5 text-solana-green" />, text: "Guaranteed attention" },
    { icon: <Heart className="w-5 h-5 text-solana-green" />, text: "Support creators directly" },
    { icon: <Zap className="w-5 h-5 text-solana-green" />, text: "Instant 1:1 access" },
    { icon: <CheckCircle2 className="w-5 h-5 text-solana-green" />, text: "Transparent on-chain proof" }
  ];

  return (
    <section id="creators" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          
          {/* For Creators */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-solana-purple/10 to-transparent p-8 md:p-12 rounded-3xl border border-solana-purple/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-solana-purple/20 rounded-full mix-blend-screen filter blur-[80px] -z-10"></div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">For Creators</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Monetize your attention. Filter out the noise and connect with your true supporters.
            </p>
            <ul className="space-y-4">
              {creatorBenefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3 text-lg">
                  {benefit.icon}
                  <span>{benefit.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* For Fans */}
          <motion.div
            id="fans"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-bl from-solana-green/10 to-transparent p-8 md:p-12 rounded-3xl border border-solana-green/20 relative overflow-hidden"
          >
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-solana-green/20 rounded-full mix-blend-screen filter blur-[80px] -z-10"></div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">For Fans</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Skip the line. Get guaranteed responses and exclusive access to the creators you love.
            </p>
            <ul className="space-y-4">
              {fanBenefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3 text-lg">
                  {benefit.icon}
                  <span>{benefit.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
