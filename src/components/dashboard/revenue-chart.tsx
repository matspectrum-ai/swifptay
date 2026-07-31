'use client'

import { Card } from '@/components/ui/card'

interface RevenueChartProps {
  data: { date: string; amount: number }[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  const maxAmount = Math.max(...data.map((d) => d.amount), 1)

  return (
    <Card variant="elevated" className="p-5">
      <h3 className="font-display font-bold text-text mb-4">Receita últimos 7 dias</h3>
      <div className="flex items-end gap-2 h-48">
        {data.map((item, index) => {
          const height = (item.amount / maxAmount) * 100
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-primary/80 rounded-t-lg transition-all duration-300 hover:bg-primary"
                style={{ height: `${Math.max(height, 4)}%` }}
              />
              <span className="text-xs text-text-secondary">{item.date}</span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}