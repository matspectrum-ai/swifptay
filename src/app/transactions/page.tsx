'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { formatDate } from '@/lib/utils'

interface Transaction {
  id: string
  amount: number
  status: string
  type: string
  method: string
  createdAt: string
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    if (statusFilter) params.set('status', statusFilter)
    if (typeFilter) params.set('type', typeFilter)

    fetch(`/api/v1/transactions?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setTransactions(data.data || []))
  }, [statusFilter, typeFilter])

  const statusVariant = {
    COMPLETED: 'success',
    PENDING: 'warning',
    FAILED: 'error',
    REFUNDED: 'default',
  } as const

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-2xl text-text">Transações</h1>

      <div className="flex gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-surface border border-white/5 rounded-lg text-text text-sm focus:outline-none focus:border-primary"
        >
          <option value="">Todos os status</option>
          <option value="COMPLETED">Completado</option>
          <option value="PENDING">Pendente</option>
          <option value="FAILED">Falhou</option>
          <option value="REFUNDED">Reembolsado</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 bg-surface border border-white/5 rounded-lg text-text text-sm focus:outline-none focus:border-primary"
        >
          <option value="">Todos os tipos</option>
          <option value="INCOME">Receita</option>
          <option value="EXPENSE">Despesa</option>
        </select>
      </div>

      <Card variant="elevated" className="overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary">Data</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary">Tipo</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary">Status</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-text-secondary">Valor</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-white/5 last:border-0 hover:bg-surface-elevated/50">
                <td className="px-4 py-3 text-sm text-text-secondary">
                  {formatDate(new Date(tx.createdAt))}
                </td>
                <td className="px-4 py-3 text-sm text-text">
                  {tx.type === 'INCOME' ? 'Receita' : 'Despesa'}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariant[tx.status as keyof typeof statusVariant] || 'default'}>
                    {tx.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm font-mono text-right">
                  {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}