import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Inbox, Users, Wallet } from "lucide-react";

export function Problem() {
  const problems = [
    {
      icon: <Inbox className="w-6 h-6 text-red-400" />,
      title: "Creators Get Spammed",
      description: "DMs are chaotic. It's impossible to filter out the noise and find genuine messages from real supporters."
    },
    {
      icon: <AlertCircle className="w-6 h-6 text-orange-400" />,
      title: "No Signal-to-Noise Ratio",
      description: "High-value connections are lost in a sea of bots, scammers, and low-effort messages."
    },
    {
      icon: <Wallet className="w-6 h-6 text-yellow-400" />,
      title: "Web2 Takes Huge Cuts",
      description: "Traditional platforms take 30-50% of creator earnings just for facilitating a connection."
    }
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
          >
            The Creator Economy is Broken
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Current platforms fail both creators and fans. We're fixing the fundamental issues of access and monetization.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors h-full">
                <CardContent className="p-6 flex flex-col items-start text-left gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                    {problem.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{problem.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {problem.description}
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
