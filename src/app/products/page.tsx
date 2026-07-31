'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'

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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    fetch('/api/v1/products')
      .then((res) => res.json())
      .then((data) => setProducts(data.data || []))
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()

    const res = await fetch('/api/v1/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        price: parseFloat(price),
        description,
        category,
      }),
    })

    if (res.ok) {
      setShowForm(false)
      setName('')
      setPrice('')
      setDescription('')
      setCategory('')
      const data = await res.json()
      setProducts([data.data, ...products])
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/v1/products/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setProducts(products.filter((p) => p.id !== id))
    }
  }

  async function handleToggle(id: string, currentStatus: boolean) {
    const res = await fetch(`/api/v1/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !currentStatus }),
    })
    if (res.ok) {
      setProducts(
        products.map((p) =>
          p.id === id ? { ...p, isActive: !currentStatus } : p
        )
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-text">Produtos</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : '+ Novo Produto'}
        </Button>
      </div>

      {showForm && (
        <Card variant="elevated" className="p-6">
          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              id="name"
              label="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              id="price"
              label="Preço (R$)"
              type="number"
              step="0.01"
              min="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <Input
              id="description"
              label="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Input
              id="category"
              label="Categoria"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <Button type="submit">Criar Produto</Button>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.id} variant="elevated" className="p-5">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-display font-bold text-text">{product.name}</h3>
              <Badge variant={product.isActive ? 'success' : 'default'}>
                {product.isActive ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
            {product.description && (
              <p className="text-sm text-text-secondary mb-3">{product.description}</p>
            )}
            <p className="font-mono text-lg text-primary font-bold">
              {formatCurrency(product.price)}
            </p>
            {product.category && (
              <p className="text-xs text-text-secondary mt-1">{product.category}</p>
            )}
            <div className="flex gap-2 mt-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleToggle(product.id, product.isActive)}
              >
                {product.isActive ? 'Desativar' : 'Ativar'}
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleDelete(product.id)}>
                Excluir
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}