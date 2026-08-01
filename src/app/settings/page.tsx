'use client'

import DashboardLayout from '@/components/layout/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

export default function SettingsPage() {
  const sessionData = useSession()
  const session = sessionData?.data
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  if (!session?.user) {
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await fetch('/api/v1/user', { credentials: 'same-origin', 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="font-display font-bold text-2xl text-text">Ajustes</h1>

        <Card variant="elevated" className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="name"
              label="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
            />
            <Input
              id="email"
              label="Email"
              value={session.user.email || ''}
              disabled
            />
            <Button type="submit" loading={saving}>
              Salvar alterações
            </Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}
