'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Erro ao registrar')
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4">
      <Card variant="elevated" className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-bg font-display font-bold text-2xl">S</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-text">SwiftPay</h1>
          <p className="text-text-secondary mt-2">Crie sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="name"
            label="Nome"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            id="email"
            type="email"
            label="Email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            type="password"
            label="Senha"
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button type="submit" className="w-full" size="lg">
            Criar conta
          </Button>
        </form>
      </Card>
    </div>
  )
}