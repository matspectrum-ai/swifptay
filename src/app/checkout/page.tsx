'use client'

import DashboardLayout from '@/components/layout/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import QRCode from 'qrcode'
import { buildPixPayload } from '@/lib/pix/payload'

export default function CheckoutPage() {
  const sessionData = useSession()
  const session = sessionData?.data
  const [amount, setAmount] = useState('')
  const [pixKey, setPixKey] = useState('')
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [pixPayload, setPixPayload] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCreateCharge(e: React.FormEvent) {
    e.preventDefault()
    if (!session?.user?.id) {
      setError('Faça login para criar uma cobrança')
      return
    }

    setLoading(true)
    setError(null)
    setQrCode(null)
    setPixPayload(null)

    try {
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
        const payload = buildPixPayload(
          pixKey,
          parseFloat(amount),
          'SwiftPay',
          'São Paulo',
          data.data?.id || data.data?.transactionId || data.data?.id
        )
        const qrDataUrl = await QRCode.toDataURL(payload, {
          width: 300,
          margin: 2,
          color: {
            dark: '#0A0A0A',
            light: '#7CFC00',
          },
        })
        setQrCode(qrDataUrl)
        setPixPayload(payload)
      } else {
        const err = await res.json()
        setError(err.error || 'Erro ao criar cobrança')
      }
    } catch {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto space-y-6">
        <h1 className="font-display font-bold text-2xl text-text">Receber Pix</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

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

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Gerar QR Code
            </Button>
          </form>
        </Card>

        {qrCode && (
          <Card variant="elevated" className="p-6 text-center">
            <h3 className="font-display font-bold text-text mb-4">QR Code do Pagamento</h3>
            <div className="bg-surface rounded-lg p-6 inline-block">
              <img src={qrCode} alt="QR Code Pix" className="w-48 h-48" />
            </div>
            <p className="text-sm text-text-secondary mt-4">
              QR Code válido por 24 horas
            </p>
            {pixPayload && (
              <details className="mt-4 text-left">
                <summary className="text-xs text-text-secondary cursor-pointer mb-2">Payload Pix (EMVCo)</summary>
                <pre className="bg-surface p-3 rounded-lg text-xs text-text-secondary overflow-x-auto break-all">
                  {pixPayload}
                </pre>
              </details>
            )}
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
