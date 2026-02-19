"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  html: string;
  className?: string;
}

export function CodeBlock({ html, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // 从 HTML 中提取纯文本代码
  const extractCode = (htmlString: string): string => {
    // 移除 HTML 标签，只保留文本
    const temp = document.createElement("div");
    temp.innerHTML = htmlString;
    return temp.textContent || temp.innerText || "";
  };

  const handleCopy = async () => {
    try {
      const code = extractCode(html);
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className={cn("code-block-wrapper", className)}>
      <button
        onClick={handleCopy}
        className="copy-button"
        aria-label={copied ? "已复制" : "复制代码"}
      >
        {copied ? (
          <span className="flex items-center gap-1">
            <Check className="h-3 w-3" />
            已复制
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <Copy className="h-3 w-3" />
            复制
          </span>
        )}
      </button>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
