'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border hover:brightness-95 active:scale-[0.98]',
        black: 'bg-[var(--text)] text-[var(--bg)] hover:opacity-90 active:scale-[0.98]',
        outline: 'border bg-[var(--bg)] text-[var(--text)] hover:bg-[var(--bg-hover)] active:scale-[0.98]',
        ghost: 'text-[var(--text)] hover:bg-[var(--bg-hover)] active:scale-[0.98]',
        destructive: 'bg-red-500 text-white hover:bg-red-600 active:scale-[0.98]',
        link: 'text-[var(--text)] underline-offset-4 hover:underline',
        accent: 'border hover:brightness-95 active:scale-[0.98]',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-11 px-6 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

// Apply CSS vars via style prop for variants that need them, since Tailwind
// can't interpolate arbitrary CSS vars at build time cleanly for all combinations.
const variantStyles: Record<string, React.CSSProperties> = {
  default: {
    background: 'var(--accent-bg)',
    borderColor: 'var(--accent-border)',
    color: 'var(--accent-text)',
  },
  outline: {
    borderColor: 'var(--border)',
  },
  accent: {
    background: 'var(--accent-bg)',
    borderColor: 'var(--accent-border)',
    color: 'var(--accent-text)',
  },
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    const extraStyle = variantStyles[variant ?? 'default'] ?? {}
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        style={{ ...extraStyle, ...style }}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
