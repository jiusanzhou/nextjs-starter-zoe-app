"use client";

import React from "react";
import { Check, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PricingFeature {
  name: string;
  included: boolean | string;
  tooltip?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  description?: string;
  price: number | string;
  priceUnit?: string; // 默认 "/月"
  originalPrice?: number; // 原价（显示划线价）
  currency?: string; // 默认 "¥"
  features: PricingFeature[];
  cta?: string; // 按钮文字
  ctaLink?: string;
  popular?: boolean; // 推荐标签
  badge?: string; // 自定义标签
}

interface PricingTableProps {
  plans: PricingPlan[];
  title?: string;
  description?: string;
  yearlyDiscount?: number; // 年付折扣百分比
  showToggle?: boolean; // 显示月付/年付切换
  className?: string;
}

export function PricingCard({
  plan,
  yearly = false,
  yearlyDiscount = 0,
}: {
  plan: PricingPlan;
  yearly?: boolean;
  yearlyDiscount?: number;
}) {
  const currency = plan.currency || "¥";
  const priceUnit = plan.priceUnit || "/月";
  
  // 计算年付价格
  let displayPrice = plan.price;
  let displayUnit = priceUnit;
  
  if (yearly && typeof plan.price === "number" && yearlyDiscount > 0) {
    const yearlyPrice = plan.price * 12 * (1 - yearlyDiscount / 100);
    displayPrice = Math.round(yearlyPrice);
    displayUnit = "/年";
  }

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md",
        plan.popular && "border-primary shadow-lg scale-105 z-10"
      )}
    >
      {/* 推荐标签 */}
      {(plan.popular || plan.badge) && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
            {plan.popular && <Sparkles className="h-3 w-3" />}
            {plan.badge || "推荐"}
          </span>
        </div>
      )}

      {/* 套餐名称 */}
      <div className="mb-4">
        <h3 className="text-xl font-bold">{plan.name}</h3>
        {plan.description && (
          <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
        )}
      </div>

      {/* 价格 */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-lg text-muted-foreground">{currency}</span>
          <span className="text-4xl font-bold tracking-tight">
            {typeof displayPrice === "number" ? displayPrice : displayPrice}
          </span>
          <span className="text-muted-foreground">{displayUnit}</span>
        </div>
        {plan.originalPrice && (
          <div className="mt-1 text-sm text-muted-foreground line-through">
            {currency}{plan.originalPrice}{priceUnit}
          </div>
        )}
      </div>

      {/* CTA 按钮 */}
      <Button
        className="mb-6 w-full"
        variant={plan.popular ? "default" : "outline"}
        asChild={!!plan.ctaLink}
      >
        {plan.ctaLink ? (
          <a href={plan.ctaLink}>{plan.cta || "开始使用"}</a>
        ) : (
          <span>{plan.cta || "开始使用"}</span>
        )}
      </Button>

      {/* 功能列表 */}
      <ul className="space-y-3 text-sm">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            {feature.included === true ? (
              <Check className="h-5 w-5 shrink-0 text-green-500" />
            ) : feature.included === false ? (
              <X className="h-5 w-5 shrink-0 text-muted-foreground/50" />
            ) : (
              <Check className="h-5 w-5 shrink-0 text-green-500" />
            )}
            <span className={cn(feature.included === false && "text-muted-foreground/50")}>
              {feature.name}
              {typeof feature.included === "string" && (
                <span className="ml-1 text-muted-foreground">({feature.included})</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PricingTable({
  plans,
  title,
  description,
  yearlyDiscount = 20,
  showToggle = true,
  className,
}: PricingTableProps) {
  const [yearly, setYearly] = React.useState(false);

  return (
    <div className={cn("py-12", className)}>
      {/* 标题 */}
      {(title || description) && (
        <div className="mb-10 text-center">
          {title && <h2 className="text-3xl font-bold tracking-tight">{title}</h2>}
          {description && (
            <p className="mt-3 text-lg text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {/* 月付/年付切换 */}
      {showToggle && yearlyDiscount > 0 && (
        <div className="mb-8 flex items-center justify-center gap-4">
          <span className={cn("text-sm", !yearly && "font-medium")}>月付</span>
          <button
            onClick={() => setYearly(!yearly)}
            className={cn(
              "relative h-6 w-11 rounded-full transition-colors",
              yearly ? "bg-primary" : "bg-muted"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                yearly && "translate-x-5"
              )}
            />
          </button>
          <span className={cn("text-sm", yearly && "font-medium")}>
            年付
            <span className="ml-1 text-xs text-green-500">省 {yearlyDiscount}%</span>
          </span>
        </div>
      )}

      {/* 价格卡片 */}
      <div
        className={cn(
          "grid gap-6 mx-auto max-w-5xl",
          plans.length === 1 && "max-w-md",
          plans.length === 2 && "md:grid-cols-2 max-w-3xl",
          plans.length >= 3 && "md:grid-cols-3"
        )}
      >
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            yearly={yearly}
            yearlyDiscount={yearlyDiscount}
          />
        ))}
      </div>
    </div>
  );
}
