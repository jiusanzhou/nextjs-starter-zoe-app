"use client";

import { useEffect, useRef, useState } from "react";
import lottie, { AnimationItem, AnimationConfigWithData, AnimationConfigWithPath } from "lottie-web";
import { cn } from "@/lib/utils";

interface LottieProps {
  animationData?: object;
  path?: string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  width?: number | string;
  height?: number | string;
  speed?: number;
  onComplete?: () => void;
  onLoopComplete?: () => void;
}

export function Lottie({
  animationData,
  path,
  loop = true,
  autoplay = true,
  className,
  width,
  height,
  speed = 1,
  onComplete,
  onLoopComplete,
}: LottieProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!animationData && !path) return;

    // 清理之前的动画
    if (animationRef.current) {
      animationRef.current.destroy();
    }

    let options: AnimationConfigWithData | AnimationConfigWithPath;

    if (animationData) {
      options = {
        container: containerRef.current,
        renderer: "svg",
        loop,
        autoplay,
        animationData,
      };
    } else {
      options = {
        container: containerRef.current,
        renderer: "svg",
        loop,
        autoplay,
        path: path!,
      };
    }

    animationRef.current = lottie.loadAnimation(options);
    animationRef.current.setSpeed(speed);

    animationRef.current.addEventListener("DOMLoaded", () => {
      setIsLoaded(true);
    });

    if (onComplete) {
      animationRef.current.addEventListener("complete", onComplete);
    }

    if (onLoopComplete) {
      animationRef.current.addEventListener("loopComplete", onLoopComplete);
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
    };
  }, [animationData, path, loop, autoplay, speed, onComplete, onLoopComplete]);

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      ref={containerRef}
      className={cn(
        "lottie-container",
        !isLoaded && "opacity-0",
        isLoaded && "opacity-100 transition-opacity duration-300",
        className
      )}
      style={style}
    />
  );
}

// 便捷的控制方法
export function useLottie() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  const load = (options: {
    animationData?: object;
    path?: string;
    loop?: boolean;
    autoplay?: boolean;
  }) => {
    if (!containerRef.current) return;

    if (animationRef.current) {
      animationRef.current.destroy();
    }

    animationRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: options.loop ?? true,
      autoplay: options.autoplay ?? true,
      ...(options.animationData
        ? { animationData: options.animationData }
        : { path: options.path }),
    });
  };

  const play = () => animationRef.current?.play();
  const pause = () => animationRef.current?.pause();
  const stop = () => animationRef.current?.stop();
  const setSpeed = (speed: number) => animationRef.current?.setSpeed(speed);
  const goToAndPlay = (value: number, isFrame?: boolean) =>
    animationRef.current?.goToAndPlay(value, isFrame);
  const goToAndStop = (value: number, isFrame?: boolean) =>
    animationRef.current?.goToAndStop(value, isFrame);

  return {
    containerRef,
    animationRef,
    load,
    play,
    pause,
    stop,
    setSpeed,
    goToAndPlay,
    goToAndStop,
  };
}
