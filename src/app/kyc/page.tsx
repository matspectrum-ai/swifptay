'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'

interface KycDocument {
  id: string
  type: string
  status: string
  uploadedAt: string
  verifiedAt: string | null
}

export default function KycPage() {
  const [kycStatus, setKycStatus] = useState<'PENDING' | 'VERIFIED' | 'REJECTED'>('PENDING')
  const [documents, setDocuments] = useState<KycDocument[]>([])
  const [showUpload, setShowUpload] = useState(false)
  const [docType, setDocType] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/v1/kyc')
      .then((res) => res.json())
      .then((data) => {
        setKycStatus(data.data?.kycStatus || 'PENDING')
        setDocuments(data.data?.documents || [])
      })
  }, [])

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/v1/kyc/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: docType }),
    })

    if (res.ok) {
      const data = await res.json()
      setDocuments([data.data, ...documents])
      setDocType('')
      setShowUpload(false)
    }

    setLoading(false)
  }

  const statusVariant = {
    PENDING: 'warning',
    VERIFIED: 'success',
    REJECTED: 'error',
  } as const

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="font-display font-bold text-2xl text-text">Compliance / KYC</h1>

      <Card variant="elevated" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-text">Status da Verificação</h2>
          <Badge variant={statusVariant[kycStatus]}>
            {kycStatus === 'PENDING' ? 'Pendente' : kycStatus === 'VERIFIED' ? 'Verificado' : 'Rejeitado'}
          </Badge>
        </div>

        {kycStatus === 'PENDING' && (
          <p className="text-sm text-text-secondary">
            Envie seus documentos de identidade e comprovante de residência para verificação.
            O processo leva até 24 horas.
          </p>
        )}

        {kycStatus === 'VERIFIED' && (
          <p className="text-sm text-primary">
            Sua conta está verificada. Você tem acesso a todos os recursos e limites elevados.
          </p>
        )}

        {kycStatus === 'REJECTED' && (
          <p className="text-sm text-red-400">
            Seu pedido de verificação foi rejeitado. Envie novos documentos para tentar novamente.
          </p>
        )}
      </Card>

      <Card variant="elevated" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-text">Documentos</h2>
          <Button onClick={() => setShowUpload(!showUpload)} size="sm">
            {showUpload ? 'Cancelar' : '+ Enviar Documento'}
          </Button>
        </div>

        {showUpload && (
          <form onSubmit={handleUpload} className="space-y-4 mb-6 pb-6 border-b border-white/5">
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full px-4 py-2.5 bg-surface border border-white/10 rounded-lg text-text focus:outline-none focus:border-primary"
              required
            >
              <option value="">Selecione o tipo de documento</option>
              <option value="identity">Identidade (RG/CPF)</option>
              <option value="proof_of_address">Comprovante de Residência</option>
              <option value="business">Documento Empresarial (CNPJ)</option>
            </select>
            <Button type="submit" loading={loading}>
              Enviar
            </Button>
          </form>
        )}

        <div className="space-y-3">
          {documents.length === 0 ? (
            <p className="text-sm text-text-secondary">Nenhum documento enviado ainda.</p>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-text">{doc.type}</p>
                  <p className="text-xs text-text-secondary">{formatDate(new Date(doc.uploadedAt))}</p>
                </div>
                <Badge variant={statusVariant[doc.status as keyof typeof statusVariant] || 'default'}>
                  {doc.status === 'PENDING' ? 'Pendente' : doc.status === 'VERIFIED' ? 'Verificado' : 'Rejeitado'}
                </Badge>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}