'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'

interface Notification {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  createdAt: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetch('/api/v1/notifications')
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data.data || [])
        setUnreadCount(data.data?.filter((n: Notification) => !n.read).length || 0)
      })
  }, [])

  async function markAsRead(id: string) {
    await fetch(`/api/v1/notifications/${id}/read`, { method: 'PATCH' })
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  async function markAllAsRead() {
    await fetch('/api/v1/notifications/read-all', { method: 'PATCH' })
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const typeIcon = {
    payment_received: '💰',
    payment_failed: '❌',
    withdrawal_processed: '🏦',
    withdrawal_failed: '⚠️',
    kyc_verified: '✅',
    kyc_rejected: '❌',
    system: '🔔',
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-text">Notificações</h1>
        {unreadCount > 0 && (
          <Button variant="secondary" size="sm" onClick={markAllAsRead}>
            Marcar todas como lidas ({unreadCount})
          </Button>
        )}
      </div>

      <Card variant="elevated" className="overflow-hidden">
        {notifications.length === 0 ? (
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
                <span className="text-xl mt-0.5">{typeIcon[notification.type as keyof typeof typeIcon] || '🔔'}</span>
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
  )
}