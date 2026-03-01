import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Lock, Shield, Zap, Wallet, Fingerprint } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <Wallet className="w-6 h-6 text-solana-green" />,
      title: "Solana-Native Payments",
      description: "Fast, secure, and low-fee transactions directly on the Solana blockchain."
    },
    {
      icon: <Fingerprint className="w-6 h-6 text-solana-blue" />,
      title: "Wallet Authentication",
      description: "No passwords or emails required. Sign in securely with your Web3 wallet."
    },
    {
      icon: <Shield className="w-6 h-6 text-solana-purple" />,
      title: "Spam-Free Inbox",
      description: "Only verified, paying users can reach you. Say goodbye to bots and noise."
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      title: "Instant Unlock",
      description: "Access is granted immediately upon on-chain payment confirmation."
    },
    {
      icon: <Lock className="w-6 h-6 text-orange-400" />,
      title: "Creator-Controlled Pricing",
      description: "Set your own rates for messages, calls, or exclusive content."
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />,
      title: "Transparent Verification",
      description: "Every transaction is verifiable on-chain, ensuring complete transparency."
    }
  ];

  return (
    <section id="features" className="py-24 bg-black/50 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
          >
            Powerful Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Everything you need to monetize your attention and connect authentically.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 h-full">
                <CardContent className="p-6 flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
