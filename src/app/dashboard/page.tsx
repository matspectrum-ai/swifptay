'use client'

import DashboardLayout from '@/components/layout/dashboard-layout'
import { StatsCard } from '@/components/dashboard/stats-card'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'

export default function DashboardPage() {
  const stats = {
    balance: 15420.5,
    totalIncome: 28750.0,
    totalExpenses: 13329.5,
    transactionCount: 142,
  }

  const revenueData = [
    { date: 'Seg', amount: 3200 },
    { date: 'Ter', amount: 4100 },
    { date: 'Qua', amount: 2800 },
    { date: 'Qui', amount: 5200 },
    { date: 'Sex', amount: 3900 },
    { date: 'Sáb', amount: 1800 },
    { date: 'Dom', amount: 950 },
  ]

  const recentTransactions = [
    { id: '1', amount: 150.0, status: 'COMPLETED', type: 'INCOME', createdAt: '2026-07-31T10:30:00Z' },
    { id: '2', amount: 89.9, status: 'COMPLETED', type: 'INCOME', createdAt: '2026-07-31T09:15:00Z' },
    { id: '3', amount: 250.0, status: 'PENDING', type: 'INCOME', createdAt: '2026-07-31T08:00:00Z' },
    { id: '4', amount: 45.0, status: 'FAILED', type: 'INCOME', createdAt: '2026-07-30T22:45:00Z' },
    { id: '5', amount: 1200.0, status: 'COMPLETED', type: 'INCOME', createdAt: '2026-07-30T18:30:00Z' },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-display font-bold text-2xl text-text">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Saldo" value={stats.balance} icon="💰" variant="income" />
          <StatsCard title="Receitas" value={stats.totalIncome} icon="📈" variant="income" />
          <StatsCard title="Despesas" value={stats.totalExpenses} icon="📉" variant="expense" />
          <StatsCard title="Transações" value={stats.transactionCount} icon="📋" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart data={revenueData} />
          <RecentTransactions transactions={recentTransactions} />
        </div>
      </div>
    </DashboardLayout>
  )
}