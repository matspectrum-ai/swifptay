'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { formatDate } from '@/lib/utils'

interface RecentTransactionsProps {
  transactions: Array<{
    id: string
    amount: number
    status: string
    type: string
    createdAt: string
  }>
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const statusVariant = {
    COMPLETED: 'success',
    PENDING: 'warning',
    FAILED: 'error',
    REFUNDED: 'default',
  } as const

  return (
    <Card variant="elevated" className="p-5">
      <h3 className="font-display font-bold text-text mb-4">Últimas transações</h3>
      <div className="space-y-3">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
          >
            <div>
              <p className="text-sm font-medium text-text">
                {tx.type === 'INCOME' ? 'Recebido' : 'Enviado'}
              </p>
              <p className="text-xs text-text-secondary">{formatDate(new Date(tx.createdAt))}</p>
            </div>
            <div className="text-right">
              <p
                className={`text-sm font-mono font-medium ${
                  tx.type === 'INCOME' ? 'text-primary' : 'text-text'
                }`}
              >
                {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
              </p>
              <Badge variant={statusVariant[tx.status as keyof typeof statusVariant] || 'default'}>
                {tx.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}