'use client'

import { useRef, useState } from 'react'

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>
  accept?: string
  label?: string
  loading?: boolean
}

export function FileUpload({ onUpload, accept = 'image/*,.pdf', label = 'Enviar arquivo', loading = false }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    try {
      await onUpload(file)
    } catch {
      setError('Erro ao enviar arquivo')
    }
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        disabled={loading}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="w-full px-4 py-3 bg-surface border border-dashed border-white/10 rounded-lg text-sm text-text-secondary hover:border-primary hover:text-text transition-colors"
      >
        {label}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
