'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

interface BalanceData {
  balance: number
  totalIncome: number
  totalExpenses: number
}

export default function BalancePage() {
  const [balance, setBalance] = useState<BalanceData | null>(null)

  useEffect(() => {
    fetch('/api/v1/balance')
      .then((res) => res.json())
      .then((data) => setBalance(data.data))
  }, [])

  if (!balance) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-text-secondary">Carregando saldo...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-2xl text-text">Saldo</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="elevated" className="p-6 text-center">
          <p className="text-sm text-text-secondary">Saldo Disponível</p>
          <p className="font-display font-bold text-3xl text-primary mt-2">
            {formatCurrency(balance.balance)}
          </p>
        </Card>
        <Card variant="elevated" className="p-6 text-center">
          <p className="text-sm text-text-secondary">Receitas</p>
          <p className="font-display font-bold text-3xl text-text mt-2">
            {formatCurrency(balance.totalIncome)}
          </p>
        </Card>
        <Card variant="elevated" className="p-6 text-center">
          <p className="text-sm text-text-secondary">Despesas</p>
          <p className="font-display font-bold text-3xl text-text mt-2">
            {formatCurrency(balance.totalExpenses)}
          </p>
        </Card>
      </div>
    </div>
  )
}