import { motion } from "motion/react";
import { Wallet, Search, Coins, CheckCircle, MessageCircle } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: <Wallet className="w-6 h-6" />,
      title: "Connect Wallet",
      description: "Sign in with Phantom, Solflare, or any Solana wallet."
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Select Creator",
      description: "Find the creator you want to connect with."
    },
    {
      icon: <Coins className="w-6 h-6" />,
      title: "Pay in SOL",
      description: "Send the required amount of SOL to their address."
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Payment Verified",
      description: "On-chain verification happens in milliseconds."
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Unlock Private Chat",
      description: "Start your 1:1 conversation immediately."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            A seamless, decentralized experience from start to finish.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-solana-purple via-solana-blue to-solana-green md:-translate-x-1/2 opacity-20" />
          
          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className={`flex-1 w-full ${index % 2 === 0 ? "md:text-left" : "md:text-right"}`}>
                  <div className={`bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors inline-block w-full md:w-auto ${index % 2 === 0 ? "md:mr-auto" : "md:ml-auto"}`}>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                
                <div className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full bg-background border-2 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)] text-white">
                  {step.icon}
                </div>
                
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
