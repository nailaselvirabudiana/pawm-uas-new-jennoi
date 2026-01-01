import * as React from "react";
import { TouchableOpacity, Text, type ViewProps, type TouchableOpacityProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils"; // Pastikan path utils benar

const buttonVariants = cva(
  "flex-row items-center justify-center rounded-lg active:opacity-70 disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary",
        destructive: "bg-destructive",
        outline: "border border-border bg-background",
        secondary: "bg-secondary",
        ghost: "bg-transparent",
        link: "bg-transparent",
      },
      size: {
        default: "h-12 px-5 py-3",
        sm: "h-10 px-3 py-2",
        lg: "h-14 px-8 py-4",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Helper untuk mengatur warna teks berdasarkan variant
const textVariants = cva("text-sm font-medium", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      destructive: "text-white",
      outline: "text-foreground",
      secondary: "text-secondary-foreground",
      ghost: "text-foreground",
      link: "text-primary underline",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface ButtonProps
  extends Omit<TouchableOpacityProps, 'children'>,
    VariantProps<typeof buttonVariants> {
  children?: React.ReactNode | string;
  textClassName?: string;
}

function Button({
  className,
  textClassName,
  variant,
  size,
  children,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {typeof children === "string" ? (
        <Text className={cn(textVariants({ variant, className: textClassName }))}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

export { Button, buttonVariants };