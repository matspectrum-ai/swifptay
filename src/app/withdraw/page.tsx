'use client'

import DashboardLayout from '@/components/layout/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { formatDate } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

interface Withdrawal {
  id: string
  amount: number
  pixKey: string
  status: string
  createdAt: string
}

export default function WithdrawPage() {
  const sessionData = useSession()
  const session = sessionData?.data
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [amount, setAmount] = useState('')
  const [pixKey, setPixKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [historyLoading, setHistoryLoading] = useState(true)

  useEffect(() => {
    if (!session?.user?.id) return

    setHistoryLoading(true)
    fetch('/api/v1/withdrawals', { credentials: 'same-origin' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch withdrawals')
        return res.json()
      })
      .then((data) => setWithdrawals(data.data || []))
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar histórico'))
      .finally(() => setHistoryLoading(false))
  }, [session?.user?.id])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/v1/withdrawals', { credentials: 'same-origin', 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          pixKey,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setWithdrawals([data.data, ...withdrawals])
        setAmount('')
        setPixKey('')
      } else {
        const err = await res.json()
        setError(err.error || 'Erro ao solicitar saque')
      }
    } catch {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  const statusVariant = {
    PROCESSING: 'warning',
    COMPLETED: 'success',
    FAILED: 'error',
  } as const

  return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto space-y-6">
        <h1 className="font-display font-bold text-2xl text-text">Saque</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <Card variant="elevated" className="p-6">
          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              id="amount"
              label="Valor (R$)"
              type="number"
              step="0.01"
              min="10"
              max="5000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <Input
              id="pixKey"
              label="Chave Pix para saque"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              required
            />

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Solicitar Saque
            </Button>
          </form>
        </Card>

        <Card variant="elevated" className="p-5">
          <h3 className="font-display font-bold text-text mb-4">Histórico de Saques</h3>
          {historyLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-white/5 rounded animate-pulse" />
              ))}
            </div>
          ) : withdrawals.length === 0 ? (
            <p className="text-sm text-text-secondary">Nenhum saque solicitado ainda.</p>
          ) : (
            <div className="space-y-3">
              {withdrawals.map((w) => (
                <div
                  key={w.id}
                  className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                >
                  <div>
                    <p className="text-sm font-mono text-text">{formatCurrency(w.amount)}</p>
                    <p className="text-xs text-text-secondary">{formatDate(new Date(w.createdAt))}</p>
                  </div>
                  <Badge variant={statusVariant[w.status as keyof typeof statusVariant] || 'default'}>
                    {w.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}
