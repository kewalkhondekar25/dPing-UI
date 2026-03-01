import { motion } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  const faqs = [
    {
      question: "How does payment verification work?",
      answer: "When a fan sends SOL to a creator's address, the transaction is verified instantly on the Solana blockchain. Once confirmed, the 1:1 chat or talk access is automatically unlocked."
    },
    {
      question: "Is it fully decentralized?",
      answer: "Yes. dPing operates entirely on-chain. We don't hold your funds, and payments go directly from the fan's wallet to the creator's wallet."
    },
    {
      question: "Which wallets are supported?",
      answer: "We support all major Solana wallets, including Phantom, Solflare, Backpack, and any wallet compatible with the Solana Wallet Adapter."
    },
    {
      question: "Does dPing take a commission?",
      answer: "dPing takes a minimal protocol fee (typically 1-2%) to maintain the infrastructure, which is significantly lower than the 30-50% taken by traditional Web2 platforms."
    },
    {
      question: "How is spam prevented?",
      answer: "Because every message or connection request requires an upfront payment in SOL, bots and spammers are economically disincentivized from sending junk messages."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-black/50 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Everything you need to know about dPing.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-white/10">
                <AccordionTrigger className="text-left text-lg hover:text-solana-green transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
