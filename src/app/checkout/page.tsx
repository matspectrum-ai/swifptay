'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'

export default function CheckoutPage() {
  const [amount, setAmount] = useState('')
  const [pixKey, setPixKey] = useState('')
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCreateCharge(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setQrCode(null)

    const res = await fetch('/api/v1/charges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: parseFloat(amount),
        pixKey,
        expiresInHours: 24,
      }),
    })

    if (res.ok) {
      const data = await res.json()
      const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#0A0A0A"/><text x="100" y="100" text-anchor="middle" fill="#7CFC00" font-size="14" font-family="monospace">QR Code</text></svg>'
      const base64 = typeof btoa !== 'undefined'
        ? btoa(unescape(encodeURIComponent(svg)))
        : Buffer.from(svg).toString('base64')
      setQrCode(data.data.qrCodeUrl || `data:image/svg+xml;base64,${base64}`)
    } else {
      const data = await res.json()
      setError(data.error || 'Erro ao criar cobrança')
    }

    setLoading(false)
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="font-display font-bold text-2xl text-text">Receber Pix</h1>

      <Card variant="elevated" className="p-6">
        <form onSubmit={handleCreateCharge} className="space-y-4">
          <Input
            id="amount"
            label="Valor (R$)"
            type="number"
            step="0.01"
            min="0.01"
            max="50000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <Input
            id="pixKey"
            label="Chave Pix"
            value={pixKey}
            onChange={(e) => setPixKey(e.target.value)}
            required
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            Gerar QR Code
          </Button>
        </form>
      </Card>

      {qrCode && (
        <Card variant="elevated" className="p-6 text-center">
          <h3 className="font-display font-bold text-text mb-4">QR Code do Pagamento</h3>
          <div className="bg-surface rounded-xl p-6 inline-block">
            <img src={qrCode} alt="QR Code Pix" className="w-48 h-48" />
          </div>
          <p className="text-sm text-text-secondary mt-4">
            QR Code válido por 24 horas
          </p>
        </Card>
      )}
    </div>
  )
}