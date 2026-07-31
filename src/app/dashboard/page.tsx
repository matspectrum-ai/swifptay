'use client'

import DashboardLayout from '@/components/layout/dashboard-layout'
import { StatsCard } from '@/components/dashboard/stats-card'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const sessionData = useSession()
  const session = sessionData?.data
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({ balance: 0, totalIncome: 0, totalExpenses: 0, transactionCount: 0 })
  const [revenueData, setRevenueData] = useState<{ date: string; amount: number }[]>([])
  const [recentTransactions, setRecentTransactions] = useState<{ id: string; amount: number; status: string; type: string; createdAt: string }[]>([])

  useEffect(() => {
    if (!session?.user?.id) return

    async function load() {
      try {
        setLoading(true)
        setError(null)

        const [balanceRes, transactionsRes] = await Promise.all([
          fetch('/api/v1/balance'),
          fetch('/api/v1/transactions?page=1&limit=10'),
        ])

        if (!balanceRes.ok || !transactionsRes.ok) {
          throw new Error('Failed to fetch dashboard data')
        }

        const balanceData = await balanceRes.json()
        const transactionsData = await transactionsRes.json()

        setStats({
          balance: balanceData.data.balance || 0,
          totalIncome: balanceData.data.totalIncome || 0,
          totalExpenses: balanceData.data.totalExpenses || 0,
          transactionCount: transactionsData.pagination?.total || 0,
        })

        setRecentTransactions((transactionsData.data || []).map((t: { id: string; amount: number; status: string; type: string; createdAt: string }) => ({
          id: t.id,
          amount: Number(t.amount),
          status: t.status,
          type: t.type,
          createdAt: t.createdAt,
        })))

        const last7 = Array.from({ length: 7 }, (_, i) => {
          const d = new Date()
          d.setDate(d.getDate() - (6 - i))
          return {
            date: d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' }),
            amount: 0,
          }
        })
        setRevenueData(last7)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dashboard')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [session?.user?.id])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="font-display font-bold text-2xl text-text">Dashboard</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-surface-elevated border border-white/5 rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-white/10 rounded w-1/2 mb-4" />
                <div className="h-8 bg-white/10 rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="font-display font-bold text-2xl text-text">Dashboard</h1>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

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
