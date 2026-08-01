'use client'

import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { ArrowLeft, ExternalLink } from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  category: string | null
  isActive: boolean
  qrCodeData: string | null
  createdAt: string
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const sessionData = useSession()
  const session = sessionData?.data
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!session?.user?.id) return
    setLoading(true)
    fetch(`/api/v1/products/${params.id}`, { credentials: 'same-origin' })
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data) => setProduct(data.data))
      .catch(() => router.push('/products'))
      .finally(() => setLoading(false))
  }, [session?.user?.id, params.id])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="h-8 bg-white/5 rounded w-48 animate-pulse" />
          <Card variant="elevated" className="p-6">
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 bg-white/5 rounded w-full" />
              ))}
            </div>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  if (!product) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Card variant="elevated" className="p-6">
            <p className="text-text-secondary">Produto não encontrado.</p>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="font-display font-bold text-2xl text-text">{product.name}</h1>
          <Badge variant={product.isActive ? 'success' : 'default'}>
            {product.isActive ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>

        <Card variant="elevated" className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-text-secondary mb-1">Preço</p>
              <p className="font-mono text-xl text-primary font-bold">{formatCurrency(product.price)}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary mb-1">Categoria</p>
              <p className="text-sm text-text">{product.category || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary mb-1">Criado em</p>
              <p className="text-sm text-text">{new Date(product.createdAt).toLocaleDateString('pt-BR')}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary mb-1">QR Code</p>
              {product.qrCodeData ? (
                <a
                  href={product.qrCodeData}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  Ver QR <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <p className="text-sm text-text-secondary">-</p>
              )}
            </div>
          </div>

          {product.description && (
            <div>
              <p className="text-xs text-text-secondary mb-1">Descrição</p>
              <p className="text-sm text-text">{product.description}</p>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}
