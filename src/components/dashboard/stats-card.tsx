'use client'

import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: number
  change?: number
  icon: string
  variant?: 'default' | 'income' | 'expense'
}

export function StatsCard({ title, value, change, icon, variant = 'default' }: StatsCardProps) {
  const isPositive = change !== undefined ? change >= 0 : true

  return (
    <Card variant="elevated" className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-secondary font-medium">{title}</p>
          <p className="text-2xl font-display font-bold text-text mt-1">
            {formatCurrency(value)}
          </p>
          {change !== undefined && (
            <p
              className={cn(
                'text-sm mt-1',
                isPositive ? 'text-primary' : 'text-red-400'
              )}
            >
              {isPositive ? '↑' : '↓'} {Math.abs(change)}%
            </p>
          )}
        </div>
        <div className="w-10 h-10 bg-surface-elevated rounded-lg flex items-center justify-center text-2xl">
          {icon}
        </div>
      </div>
    </Card>
  )
}