import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-border)] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
          'dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
