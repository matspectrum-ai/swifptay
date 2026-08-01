import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass'
}

export function Card({ className, variant = 'default', children, ...props }: CardProps) {
  const variants = {
    default: 'bg-surface',
    elevated: 'bg-surface-elevated',
    glass: 'bg-surface-glass backdrop-blur-md',
  }

  return (
    <div
      className={cn(
        'rounded-lg p-6 transition-all duration-200',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
