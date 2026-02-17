import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionProps {
  title?: ReactNode;
  subTitle?: string;
  description?: string;
  position?: "left" | "right" | "center" | "top" | "bottom";
  children: ReactNode;
  className?: string;
  wrapperClassName?: string;
  id?: string;
}

export function Section({
  title,
  subTitle,
  description,
  position = "center",
  children,
  className,
  wrapperClassName,
  id,
}: SectionProps) {
  const hasHeader = title || subTitle || description;

  // Position-based layout classes
  const positionClasses = {
    center: "flex-col items-center text-center",
    top: "flex-col items-center text-center",
    bottom: "flex-col-reverse items-center text-center",
    left: "flex-col md:flex-row md:items-center md:justify-between md:text-left gap-8",
    right: "flex-col-reverse md:flex-row-reverse md:items-center md:justify-between md:text-left gap-8",
  };

  return (
    <div className={cn("relative", wrapperClassName)}>
      <section
        id={id}
        className={cn(
          "flex py-8 md:py-12 lg:py-16 max-w-5xl mx-auto px-4",
          positionClasses[position],
          className
        )}
      >
        {hasHeader && (
          <header className={cn(
            "mb-6 md:mb-8",
            (position === "left" || position === "right") && "md:mb-0 md:max-w-[40%]"
          )}>
            {subTitle && (
              <h3 className="text-sm md:text-base font-medium text-muted-foreground uppercase tracking-wider mb-2">
                {subTitle}
              </h3>
            )}
            {title && (
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-2 text-muted-foreground">
                {description}
              </p>
            )}
          </header>
        )}
        <div className={cn(
          "w-full",
          (position === "left" || position === "right") && "md:max-w-[55%]"
        )}>
          {children}
        </div>
      </section>
    </div>
  );
}
