'use client'

import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'

interface Transaction {
  id: string
  amount: number
  status: string
  type: string
  method: string
  createdAt: string
  metadata?: Record<string, unknown>
}

const statusVariant = {
  COMPLETED: 'success',
  PENDING: 'warning',
  FAILED: 'error',
  REFUNDED: 'default',
} as const

export default function TransactionDetailPage({ params }: { params: { id: string } }) {
  const sessionData = useSession()
  const session = sessionData?.data
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!session?.user?.id) return
    setLoading(true)
    fetch(`/api/v1/transactions/${params.id}`)
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data) => setTransaction(data.data))
      .catch(() => router.push('/transactions'))
      .finally(() => setLoading(false))
  }, [session?.user?.id, params.id])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="h-8 bg-white/5 rounded w-48 animate-pulse" />
          <Card variant="elevated" className="p-6">
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 bg-white/5 rounded w-full" />
              ))}
            </div>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  if (!transaction) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Card variant="elevated" className="p-6">
            <p className="text-text-secondary">Transação não encontrada.</p>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="font-display font-bold text-2xl text-text">Transação</h1>
          <Badge variant={statusVariant[transaction.status as keyof typeof statusVariant] || 'default'}>
            {transaction.status}
          </Badge>
        </div>

        <Card variant="elevated" className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-text-secondary mb-1">Valor</p>
              <p className="font-mono text-xl text-primary font-bold">{formatCurrency(transaction.amount)}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary mb-1">Tipo</p>
              <p className="text-sm text-text">{transaction.type === 'INCOME' ? 'Receita' : 'Despesa'}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary mb-1">Método</p>
              <p className="text-sm text-text">{transaction.method}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary mb-1">Data</p>
              <p className="text-sm text-text">{formatDate(new Date(transaction.createdAt))}</p>
            </div>
          </div>

          {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
            <div>
              <p className="text-xs text-text-secondary mb-1">Metadados</p>
              <pre className="bg-surface p-3 rounded-lg text-xs text-text-secondary overflow-x-auto">
                {JSON.stringify(transaction.metadata, null, 2)}
              </pre>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}
