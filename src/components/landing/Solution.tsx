import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Lock, Shield, Zap } from "lucide-react";

export function Solution() {
  const solutions = [
    {
      icon: <Zap className="w-6 h-6 text-solana-green" />,
      title: "Pay in SOL",
      description: "Direct, fast, and low-fee payments using Solana."
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-solana-blue" />,
      title: "On-Chain Verification",
      description: "Payments are verified instantly on the blockchain."
    },
    {
      icon: <Lock className="w-6 h-6 text-solana-purple" />,
      title: "Instant Unlock",
      description: "Get immediate 1:1 access once payment is confirmed."
    },
    {
      icon: <Shield className="w-6 h-6 text-white" />,
      title: "Creator Control",
      description: "Set your own price, manage your availability."
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-black/50">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-solana-purple/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
          >
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-solana-green to-solana-blue">dPing</span> Solution
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            A decentralized, transparent, and spam-free way to connect.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 h-full group">
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300">
                    {solution.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{solution.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {solution.description}
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
