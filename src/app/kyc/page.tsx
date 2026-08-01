'use client'

import DashboardLayout from '@/components/layout/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { FileUpload } from '@/components/forms/file-upload'

interface KycDocument {
  id: string
  type: string
  status: string
  uploadedAt: string
  verifiedAt: string | null
}

export default function KycPage() {
  const sessionData = useSession()
  const session = sessionData?.data
  const [kycStatus, setKycStatus] = useState<'PENDING' | 'VERIFIED' | 'REJECTED'>('PENDING')
  const [documents, setDocuments] = useState<KycDocument[]>([])
  const [docType, setDocType] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session?.user?.id) return

    setFetchLoading(true)
    fetch('/api/v1/kyc', { credentials: 'same-origin' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch KYC')
        return res.json()
      })
      .then((data) => {
        setKycStatus(data.data?.kycStatus || 'PENDING')
        setDocuments(data.data?.documents || [])
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar KYC'))
      .finally(() => setFetchLoading(false))
  }, [session?.user?.id])

  async function handleUpload(file: File) {
    if (!docType) {
      setError('Selecione o tipo de documento')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', docType)

      const res = await fetch('/api/v1/kyc/documents', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        setDocuments([data.data, ...documents])
        setDocType('')
      } else {
        const err = await res.json()
        setError(err.error || 'Erro ao enviar documento')
      }
    } catch {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  const statusVariant = {
    PENDING: 'warning',
    VERIFIED: 'success',
    REJECTED: 'error',
  } as const

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="font-display font-bold text-2xl text-text">Compliance / KYC</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <Card variant="elevated" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-text">Status da Verificação</h2>
            <Badge variant={statusVariant[kycStatus]}>
              {kycStatus === 'PENDING' ? 'Pendente' : kycStatus === 'VERIFIED' ? 'Verificado' : 'Rejeitado'}
            </Badge>
          </div>

          {fetchLoading ? (
            <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
          ) : (
            <>
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
            </>
          )}
        </Card>

        <Card variant="elevated" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-text">Documentos</h2>
          </div>

          <div className="space-y-4 mb-6 pb-6 border-b border-white/5">
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full px-4 py-2.5 bg-surface border border-white/10 rounded-md text-text focus:outline-none focus:border-primary"
              required
            >
              <option value="">Selecione o tipo de documento</option>
              <option value="identity">Identidade (RG/CPF)</option>
              <option value="proof_of_address">Comprovante de Residência</option>
              <option value="business">Documento Empresarial (CNPJ)</option>
            </select>
            <FileUpload onUpload={handleUpload} accept="image/*,.pdf" label="Selecionar arquivo" loading={loading} />
          </div>

          {fetchLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-12 bg-white/5 rounded animate-pulse" />
              ))}
            </div>
          ) : documents.length === 0 ? (
            <p className="text-sm text-text-secondary">Nenhum documento enviado ainda.</p>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
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
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}
