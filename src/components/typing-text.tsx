"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface TypingTextProps {
  texts: string[];
  className?: string;
  typeSpeed?: number;
  backSpeed?: number;
  backDelay?: number;
  loop?: boolean;
  gradient?: string;
  underline?: boolean;
}

export function TypingText({
  texts,
  className,
  typeSpeed = 100,
  backSpeed = 50,
  backDelay = 2000,
  loop = true,
  gradient,
  underline = false,
}: TypingTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  // Cursor blink effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  // Typing effect
  useEffect(() => {
    const currentText = texts[textIndex];

    const tick = () => {
      if (isDeleting) {
        setDisplayText(currentText.substring(0, displayText.length - 1));
      } else {
        setDisplayText(currentText.substring(0, displayText.length + 1));
      }
    };

    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayText === currentText) {
      // Finished typing, wait then start deleting
      timeout = setTimeout(() => setIsDeleting(true), backDelay);
    } else if (isDeleting && displayText === "") {
      // Finished deleting, move to next text
      setIsDeleting(false);
      if (loop || textIndex < texts.length - 1) {
        setTextIndex((prev) => (prev + 1) % texts.length);
      }
    } else {
      // Continue typing or deleting
      timeout = setTimeout(tick, isDeleting ? backSpeed : typeSpeed);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, textIndex, texts, typeSpeed, backSpeed, backDelay, loop]);

  const gradientStyle = gradient
    ? {
        backgroundImage: gradient,
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
      }
    : {};

  return (
    <span
      className={cn(
        "relative inline-block px-2",
        underline && "after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[3px] after:bg-gradien after:from-purple-600 after:to-pink-500",
        className
      )}
      style={gradientStyle}
    >
      {displayText}
      <span
        className={cn(
          "inline-block w-[3px] h-[1em] ml-1 align-middle transition-opacity",
          gradient ? "bg-gradient-to-b from-purple-600 to-pink-500" : "bg-current",
          showCursor ? "opacity-100" : "opacity-0"
        )}
      />
    </span>
  );
}
