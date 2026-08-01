'use client'

import DashboardLayout from '@/components/layout/dashboard-layout'
import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

interface BalanceData {
  balance: number
  totalIncome: number
  totalExpenses: number
}

export default function BalancePage() {
  const sessionData = useSession()
  const session = sessionData?.data
  const [balance, setBalance] = useState<BalanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session?.user?.id) return

    fetch('/api/v1/balance', { credentials: 'same-origin' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch balance')
        return res.json()
      })
      .then((data) => setBalance(data.data))
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar saldo'))
      .finally(() => setLoading(false))
  }, [session?.user?.id])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="font-display font-bold text-2xl text-text">Saldo</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface-elevated rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-white/10 rounded w-1/2 mb-4" />
                <div className="h-8 bg-white/10 rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !balance) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="font-display font-bold text-2xl text-text">Saldo</h1>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
            <p className="text-red-400">{error || 'Erro ao carregar saldo'}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
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
    </DashboardLayout>
  )
}
