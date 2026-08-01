import { PixProvider } from './types'

export class PagouAdapter implements PixProvider {
  private publicKey: string
  private secretKey: string
  private baseUrl: string

  constructor(publicKey: string | null, secretKey: string | null, baseUrl: string) {
    this.publicKey = publicKey || ''
    this.secretKey = secretKey || ''
    this.baseUrl = baseUrl.replace(/\/$/, '')
  }

  private getAuthHeader(): string {
    return 'Basic ' + Buffer.from(this.publicKey + ':' + this.secretKey).toString('base64')
  }

  async createPayment(
    amountBRL: number,
    pixKey: string,
    metadata?: Record<string, unknown>
  ): Promise<{ transactionId: string; qrCodeUrl: string; expiresAt: Date }> {
    const amountInCents = Math.round(amountBRL * 100)

    const payload: Record<string, unknown> = {
      amount: amountInCents,
      payment_method: 'pix',
      pix_key: pixKey,
    }

    if (metadata?.external_ref) {
      payload.external_ref = metadata.external_ref
    }

    if (metadata?.buyer_name) {
      payload.customer = {
        name: metadata.buyer_name as string,
        email: metadata.buyer_email as string | undefined,
        phone: metadata.buyer_phone as string | undefined,
        document: metadata.buyer_document
          ? {
              type: 'CPF',
              number: String(metadata.buyer_document),
            }
          : undefined,
      }
    }

    if (metadata?.items) {
      payload.items = metadata.items
    }

    if (metadata?.expires_in) {
      payload.expires_in = metadata.expires_in
    }

    if (metadata?.postback_url) {
      payload.postback_url = metadata.postback_url
    }

    const response = await fetch(`${this.baseUrl}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.getAuthHeader(),
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`AKKADPAG API error: ${response.status} ${JSON.stringify(error)}`)
    }

    const data = await response.json()
    const transaction = data.data || data

    if (!transaction?.pix?.copy_paste && !transaction?.pix?.qr_code) {
      throw new Error('AKKADPAG response missing Pix QR code')
    }

    return {
      transactionId: String(transaction.id || transaction.transaction_id),
      qrCodeUrl: transaction.pix.qr_code || transaction.pix.copy_paste || '',
      expiresAt: transaction.pix.expires_at
        ? new Date(transaction.pix.expires_at)
        : transaction.pix.expiration_date
          ? new Date(transaction.pix.expiration_date)
          : new Date(Date.now() + 24 * 60 * 60 * 1000),
    }
  }

  async processWebhook(payload: unknown): Promise<{ status: string; transactionId?: string }> {
    const event = payload as {
      event?: string
      event_type?: string
      data?: {
        id?: string
        transaction_id?: string
        status?: string
        event_type?: string
      }
    }

    const data = event.data || {}
    const transactionId = data.transaction_id || data.id || ''
    const status = data.status || data.event_type || event.event || event.event_type || 'UNKNOWN'

    return {
      status: status.toUpperCase(),
      transactionId,
    }
  }

  async getStatus(transactionId: string): Promise<string> {
    const response = await fetch(
      `${this.baseUrl}/transactions/${encodeURIComponent(transactionId)}`,
      {
        headers: {
          Authorization: this.getAuthHeader(),
        },
      }
    )

    if (!response.ok) {
      throw new Error(`AKKADPAG API error: ${response.status}`)
    }

    const data = await response.json()
    const transaction = data.data || data
    return String(transaction.status || 'UNKNOWN')
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/company/balance`, {
        method: 'GET',
        headers: {
          Authorization: this.getAuthHeader(),
        },
      })
      return response.ok
    } catch {
      return false
    }
  }
}