import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default'
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    success: 'bg-primary/20 text-primary',
    warning: 'bg-yellow-500/20 text-yellow-400',
    error: 'bg-red-500/20 text-red-400',
    info: 'bg-blue-500/20 text-blue-400',
    default: 'bg-surface-elevated text-text-secondary',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {variant !== 'default' && (
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
      )}
      {children}
    </span>
  )
}