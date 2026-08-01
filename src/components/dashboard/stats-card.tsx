'use client'

import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Wallet, TrendingUp, TrendingDown, Receipt } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: number
  change?: number
  icon: 'wallet' | 'trending-up' | 'trending-down' | 'receipt'
  variant?: 'default' | 'income' | 'expense'
}

const iconMap = {
  wallet: Wallet,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  receipt: Receipt,
}

export function StatsCard({ title, value, change, icon, variant = 'default' }: StatsCardProps) {
  const isPositive = change !== undefined ? change >= 0 : true
  const Icon = iconMap[icon]

  return (
    <Card variant="elevated" className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-secondary font-medium">{title}</p>
          <p className="text-2xl font-display font-bold text-text mt-1">
            {variant === 'income' ? (
              <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                {formatCurrency(value)}
              </span>
            ) : (
              formatCurrency(value)
            )}
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
        <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-text-secondary" />
        </div>
      </div>
    </Card>
  )
}
