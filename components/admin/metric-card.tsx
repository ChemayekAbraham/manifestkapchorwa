import React from "react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  variant?: "default" | "clay" | "ochre" | "success" | "warning";
  className?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  variant = "default",
  className,
}: MetricCardProps) {
  const getBadgeStyle = () => {
    switch (variant) {
      case "clay":
        return "bg-clay-100 text-clay-700";
      case "ochre":
        return "bg-ochre-100 text-ochre-800";
      case "success":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-highland-100 text-highland-800";
    }
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs transition-all hover:shadow-sm",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          {title}
        </span>
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", getBadgeStyle())}>
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <div className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900">{value}</div>
        {subtitle && <p className="mt-1 text-xs text-neutral-500">{subtitle}</p>}
      </div>
    </div>
  );
}
