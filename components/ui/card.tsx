import * as React from "react";
import { View, Text, type ViewProps, type TextProps } from "react-native";
import { cn } from "../../lib/utils"; // Pastikan path utils benar

function Card({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn(
        "bg-card rounded-2xl border border-border shadow-sm overflow-hidden",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn(
        "flex-col gap-y-1.5 p-6",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: TextProps) {
  return (
    <Text
      className={cn(
        "text-foreground text-xl font-semibold leading-tight tracking-tight",
        className
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: TextProps) {
  return (
    <Text
      className={cn(
        "text-muted-foreground text-sm leading-5",
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn("px-6 pb-6", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn(
        "flex-row items-center p-6 pt-0",
        className
      )}
      {...props}
    />
  );
}

// CardAction di mobile biasanya berupa View di pojok kanan atas
function CardAction({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn(
        "absolute right-4 top-4",
        className
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};