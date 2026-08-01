'use client'

import DashboardLayout from '@/components/layout/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import {
  Wallet,
  XCircle,
  Landmark,
  AlertTriangle,
  CheckCircle2,
  X,
  Bell,
} from 'lucide-react'

interface Notification {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  createdAt: string
}

const typeIconMap: Record<string, React.ReactNode> = {
  payment_received: <Wallet className="w-5 h-5 text-primary" />,
  payment_failed: <XCircle className="w-5 h-5 text-red-400" />,
  withdrawal_processed: <Landmark className="w-5 h-5 text-primary" />,
  withdrawal_failed: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
  kyc_verified: <CheckCircle2 className="w-5 h-5 text-primary" />,
  kyc_rejected: <X className="w-5 h-5 text-red-400" />,
  system: <Bell className="w-5 h-5 text-text-secondary" />,
}

export default function NotificationsPage() {
  const sessionData = useSession()
  const session = sessionData?.data
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [markingRead, setMarkingRead] = useState<string | null>(null)

  useEffect(() => {
    if (!session?.user?.id) return

    setLoading(true)
    fetch('/api/v1/notifications')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch notifications')
        return res.json()
      })
      .then((data) => {
        setNotifications(data.data || [])
        setUnreadCount(data.data?.filter((n: Notification) => !n.read).length || 0)
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar notificações'))
      .finally(() => setLoading(false))
  }, [session?.user?.id])

  async function markAsRead(id: string) {
    setMarkingRead(id)
    try {
      await fetch(`/api/v1/notifications/${id}/read`, { method: 'PATCH' })
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch {
      setError('Erro ao marcar como lida')
    } finally {
      setMarkingRead(null)
    }
  }

  async function markAllAsRead() {
    try {
      await fetch('/api/v1/notifications/read-all', { method: 'PATCH' })
      setNotifications(notifications.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch {
      setError('Erro ao marcar todas como lidas')
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display font-bold text-2xl text-text">Notificações</h1>
          {unreadCount > 0 && (
            <Button variant="secondary" size="sm" onClick={markAllAsRead}>
              Marcar todas como lidas ({unreadCount})
            </Button>
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <Card variant="elevated" className="overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-white/5 rounded animate-pulse" />
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-6 text-center text-text-secondary">
              Nenhuma notificação
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 px-4 py-4 hover:bg-surface-elevated/50 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-surface/50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <span className="mt-0.5">
                    {typeIconMap[notification.type as keyof typeof typeIconMap] || <Bell className="w-5 h-5 text-text-secondary" />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-text">{notification.title}</p>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-text-secondary mt-1">{notification.message}</p>
                    <p className="text-xs text-text-secondary mt-2">{formatDate(new Date(notification.createdAt))}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}
