import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass'
}

export function Card({ className, variant = 'default', children, ...props }: CardProps) {
  const variants = {
    default: 'bg-surface border border-white/5',
    elevated: 'bg-surface-elevated border border-white/5 shadow-md',
    glass: 'bg-surface-glass backdrop-blur-md border border-white/10',
  }

  return (
    <div
      className={cn(
        'rounded-xl p-6 transition-all duration-200',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}