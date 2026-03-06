"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { HelpItem } from "@/lib/helpqa";
import { cn } from "@/lib/utils";

interface HelpItemDetailProps {
  item: HelpItem;
  backLabel?: string;
  feedbackLabel?: string;
  feedbackThanksLabel?: string;
}

export function HelpItemDetail({
  item,
  backLabel = "Back to Help Center",
  feedbackLabel = "Was this helpful?",
  feedbackThanksLabel = "Thanks for your feedback!",
}: HelpItemDetailProps) {
  const [voted, setVoted] = useState<number | null>(null);

  const emojis = ["\u{1F61E}", "\u{1F610}", "\u{1F603}"];

  return (
    <article className="py-6">
      {/* Back */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/help" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
        </Button>
      </div>

      {/* Category tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {item.categories.map((cat) => (
          <Badge
            key={cat.id}
            variant="secondary"
            style={{
              backgroundColor: cat.color + "20",
              borderColor: cat.color,
            }}
          >
            {cat.name}
          </Badge>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-xl md:text-2xl font-bold mb-6">{item.title}</h1>

      {/* Divider */}
      <hr className="my-4" />

      {/* Content */}
      <div
        className="prose prose-sm md:prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: item.body }}
      />

      {/* Feedback */}
      <div className="mt-10 md:mt-14 p-6 md:p-8 bg-muted/30 rounded-xl border text-center">
        <p className="text-muted-foreground mb-4">{feedbackLabel}</p>
        <div className="flex justify-center gap-4">
          {emojis.map((emoji, index) => (
            <Button
              key={index}
              variant="ghost"
              size="lg"
              className={cn(
                "text-2xl md:text-3xl transition-all hover:scale-110",
                voted !== null && voted !== index && "grayscale opacity-40",
                voted === index && "scale-125"
              )}
              onClick={() => setVoted(index)}
            >
              {emoji}
            </Button>
          ))}
        </div>
        {voted !== null && (
          <p className="mt-4 text-sm text-muted-foreground">
            {feedbackThanksLabel}
          </p>
        )}
      </div>
    </article>
  );
}
