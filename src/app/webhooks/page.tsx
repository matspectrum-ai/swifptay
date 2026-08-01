'use client'

import DashboardLayout from '@/components/layout/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

interface Webhook {
  id: string
  url: string
  events: string[]
  isActive: boolean
  createdAt: string
}

export default function WebhooksPage() {
  const sessionData = useSession()
  const session = sessionData?.data
  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [url, setUrl] = useState('')
  const [events, setEvents] = useState('payment_received,payment_failed')

  useEffect(() => {
    if (!session?.user?.id) return
    setLoading(true)
    fetch('/api/v1/webhooks', { credentials: 'same-origin' })
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data) => setWebhooks(data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [session?.user?.id])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    try {
      const res = await fetch('/api/v1/webhooks', { credentials: 'same-origin', 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, events: events.split(',').map((e) => e.trim()) }),
      })
      if (res.ok) {
        const data = await res.json()
        setWebhooks([data.data, ...webhooks])
        setUrl('')
      }
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/v1/webhooks/${id}`, { method: 'DELETE', credentials: 'same-origin' })
    setWebhooks(webhooks.filter((w) => w.id !== id))
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="font-display font-bold text-2xl text-text">Webhooks</h1>

        <Card variant="elevated" className="p-6">
          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              id="url"
              label="URL do webhook"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://seu-site.com/webhook"
              required
            />
            <Input
              id="events"
              label="Eventos (separados por vírgula)"
              value={events}
              onChange={(e) => setEvents(e.target.value)}
              required
            />
            <Button type="submit" loading={creating} className="w-full">
              Criar webhook
            </Button>
          </form>
        </Card>

        <Card variant="elevated" className="overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-12 bg-white/5 rounded animate-pulse" />
              ))}
            </div>
          ) : webhooks.length === 0 ? (
            <p className="p-6 text-sm text-text-secondary">Nenhum webhook configurado.</p>
          ) : (
            <div className="divide-y divide-white/5">
              {webhooks.map((webhook) => (
                <div key={webhook.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-text">{webhook.url}</p>
                    <div className="flex gap-2 mt-1">
                      {webhook.events.map((event) => (
                        <Badge key={event} variant="default">{event}</Badge>
                      ))}
                    </div>
                  </div>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(webhook.id)}>
                    Excluir
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}
