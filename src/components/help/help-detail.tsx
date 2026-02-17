"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { HelpItem } from "@/lib/helpqa";
import { cn } from "@/lib/utils";

interface HelpItemDetailProps {
  item: HelpItem;
}

export function HelpItemDetail({ item }: HelpItemDetailProps) {
  const [voted, setVoted] = useState<number | null>(null);

  const emojis = ["😞", "😐", "😃"];

  return (
    <article className="py-6">
      {/* 分类标签 */}
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

      {/* 标题 */}
      <h1 className="text-xl md:text-2xl font-bold mb-4">{item.title}</h1>

      {/* 分隔线 */}
      <hr className="my-4" />

      {/* 内容 */}
      <div
        className="prose prose-sm md:prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: item.body }}
      />

      {/* 反馈部分 */}
      <div className="mt-8 md:mt-12 p-6 md:p-8 bg-muted/50 rounded-lg text-center">
        <p className="text-muted-foreground mb-4">是否解决了您的问题？</p>
        <div className="flex justify-center gap-6">
          {emojis.map((emoji, index) => (
            <Button
              key={index}
              variant="ghost"
              size="lg"
              className={cn(
                "text-2xl md:text-3xl transition-all",
                voted !== null && voted !== index && "grayscale opacity-50",
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
            感谢您的反馈！
          </p>
        )}
      </div>
    </article>
  );
}
