import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-xl border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-white text-neutral-900 border-neutral-200",
        info: "bg-blue-50 text-blue-900 border-blue-200 [&>svg]:text-blue-700",
        success: "bg-green-50 text-green-900 border-green-200 [&>svg]:text-green-700",
        warning: "bg-amber-50 text-amber-900 border-amber-200 [&>svg]:text-amber-700",
        destructive: "bg-red-50 text-red-900 border-red-200 [&>svg]:text-red-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  title?: string;
}

export function Alert({ className, variant = "default", title, children, ...props }: AlertProps) {
  const getIcon = () => {
    switch (variant) {
      case "success":
        return <CheckCircle2 className="h-5 w-5" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5" />;
      case "destructive":
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  return (
    <div role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
      {getIcon()}
      {title && <h5 className="mb-1 font-semibold leading-none tracking-tight">{title}</h5>}
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}
