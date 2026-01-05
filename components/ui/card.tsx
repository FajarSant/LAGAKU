import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Card variants
const cardVariants = cva(
  "relative overflow-hidden transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-card/60 backdrop-blur-sm border",
        elevated: "bg-card shadow-lg border-0",
        glass: "bg-card/20 backdrop-blur-lg border border-white/10",
        outline: "bg-transparent border-2",
        ghost: "bg-transparent border-0 shadow-none",
      },
      hoverable: {
        true: "hover:shadow-xl hover:-translate-y-1 cursor-pointer",
        false: "",
      },
      rounded: {
        default: "rounded-xl",
        lg: "rounded-2xl",
        xl: "rounded-3xl",
        full: "rounded-full",
        none: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      hoverable: false,
      rounded: "default",
    },
  }
)

interface CardProps 
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardVariants> {
  glow?: boolean
  gradient?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, hoverable, rounded, glow, gradient, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, hoverable, rounded }),
          className,
          glow && "shadow-[0_0_40px_-10px] shadow-primary/20",
          gradient && "bg-gradient-to-br from-card via-card/80 to-card/60"
        )}
        {...props}
      >
        {/* Glow effect */}
        {glow && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        )}
        
        {/* Content wrapper */}
        <div className="relative z-10 h-full">
          {children}
        </div>
      </div>
    )
  }
)
Card.displayName = "Card"

// Header with gradient accent
const CardHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative px-6 pt-6 pb-4 border-b border-border/50",
          "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-primary/20 after:to-transparent",
          className
        )}
        {...props}
      />
    )
  }
)
CardHeader.displayName = "CardHeader"

// Title with better typography
const CardTitle = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn(
          "text-xl font-semibold tracking-tight text-foreground",
          "bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent",
          className
        )}
        {...props}
      />
    )
  }
)
CardTitle.displayName = "CardTitle"

// Description with better styling
const CardDescription = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(
          "text-sm text-muted-foreground leading-relaxed",
          "max-w-prose",
          className
        )}
        {...props}
      />
    )
  }
)
CardDescription.displayName = "CardDescription"

// Content with better spacing
const CardContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("px-6 py-4", className)}
        {...props}
      />
    )
  }
)
CardContent.displayName = "CardContent"

// Footer with gradient border
const CardFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative px-6 py-4 border-t border-border/50",
          "before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/10 before:to-transparent",
          "flex items-center gap-3",
          className
        )}
        {...props}
      />
    )
  }
)
CardFooter.displayName = "CardFooter"

// Action button area
const CardAction = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-2",
          "absolute top-4 right-4",
          className
        )}
        {...props}
      />
    )
  }
)
CardHeader.displayName = "CardHeader"

// Badge for card (new component)
interface CardBadgeProps extends React.ComponentProps<"span"> {
  variant?: "default" | "primary" | "secondary" | "outline" | "success" | "warning" | "destructive"
}

const CardBadge = React.forwardRef<HTMLSpanElement, CardBadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
          {
            "bg-primary/10 text-primary border border-primary/20": variant === "primary",
            "bg-secondary/10 text-secondary-foreground": variant === "secondary",
            "bg-background border border-border": variant === "outline",
            "bg-green-500/10 text-green-600 border border-green-500/20": variant === "success",
            "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20": variant === "warning",
            "bg-red-500/10 text-red-600 border border-red-500/20": variant === "destructive",
            "bg-muted text-muted-foreground": variant === "default",
          },
          className
        )}
        {...props}
      />
    )
  }
)
CardBadge.displayName = "CardBadge"

// Card media area (for images, etc.)
const CardMedia = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden",
          "first:rounded-t-xl last:rounded-b-xl",
          className
        )}
        {...props}
      />
    )
  }
)
CardMedia.displayName = "CardMedia"

// Card group for multiple cards
const CardGroup = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid gap-6",
          "sm:grid-cols-2 lg:grid-cols-3",
          className
        )}
        {...props}
      />
    )
  }
)
CardGroup.displayName = "CardGroup"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
  CardBadge,
  CardMedia,
  CardGroup,
}