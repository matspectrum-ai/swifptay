'use client'

import DashboardLayout from '@/components/layout/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

interface ApiKey {
  id: string
  name: string
  key: string
  isActive: boolean
  createdAt: string
}

export default function ApiKeysPage() {
  const sessionData = useSession()
  const session = sessionData?.data
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')

  useEffect(() => {
    if (!session?.user?.id) return
    setLoading(true)
    fetch('/api/v1/api-keys')
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data) => setApiKeys(data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [session?.user?.id])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    try {
      const res = await fetch('/api/v1/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (res.ok) {
        const data = await res.json()
        setApiKeys([data.data, ...apiKeys])
        setName('')
      }
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/v1/api-keys/${id}`, { method: 'DELETE' })
    setApiKeys(apiKeys.filter((k) => k.id !== id))
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="font-display font-bold text-2xl text-text">API Keys</h1>

        <Card variant="elevated" className="p-6">
          <form onSubmit={handleCreate} className="flex gap-3">
            <Input
              id="name"
              label="Nome da chave"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: integracao-loja"
              required
              className="flex-1"
            />
            <Button type="submit" loading={creating} className="mt-6">
              Criar chave
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
          ) : apiKeys.length === 0 ? (
            <p className="p-6 text-sm text-text-secondary">Nenhuma API key criada.</p>
          ) : (
            <div className="divide-y divide-white/5">
              {apiKeys.map((key) => (
                <div key={key.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-text">{key.name}</p>
                    <p className="text-xs text-text-secondary font-mono">{key.key}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={key.isActive ? 'success' : 'default'}>
                      {key.isActive ? 'Ativa' : 'Inativa'}
                    </Badge>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(key.id)}>
                      Excluir
                    </Button>
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
