"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FAQSection } from "@/types";

interface FAQSectionProps {
  config: FAQSection;
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-medium hover:text-primary transition-colors"
      >
        <span>{question}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform ml-4",
            open && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all",
          open ? "max-h-96 pb-4" : "max-h-0"
        )}
      >
        <p className="text-sm text-muted-foreground leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
}

export function FAQSectionComponent({ config }: FAQSectionProps) {
  return (
    <section className="section-base max-w-3xl mx-auto px-4 py-12 md:py-16 lg:py-20">
      {(config.title || config.description) && (
        <div className="text-center mb-12">
          {config.title && (
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
              {config.title}
            </h2>
          )}
          {config.description && (
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              {config.description}
            </p>
          )}
        </div>
      )}

      <div className="faq-container rounded-xl border bg-card p-6">
        {config.items.map((item, i) => (
          <FAQItem key={i} question={item.question} answer={item.answer} />
        ))}
      </div>
    </section>
  );
}
