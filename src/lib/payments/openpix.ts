import { PixProvider } from './types'

export class OpenPixAdapter implements PixProvider {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey: string, baseUrl: string) {
    this.apiKey = apiKey
    this.baseUrl = baseUrl
  }

  async createPayment(
    amount: number,
    pixKey: string,
    metadata?: Record<string, unknown>
  ): Promise<{ transactionId: string; qrCodeUrl: string; expiresAt: Date }> {
    const response = await fetch(`${this.baseUrl}/v1/pix/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        amount,
        pixKey,
        metadata,
        expirationMinutes: 1440,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenPix API error: ${response.status}`)
    }

    const data = await response.json()

    return {
      transactionId: data.transactionId,
      qrCodeUrl: data.qrCodeUrl,
      expiresAt: new Date(data.expiresAt),
    }
  }

  async processWebhook(payload: unknown): Promise<{ status: string; transactionId?: string }> {
    const event = payload as { type: string; data: { transactionId?: string; status?: string } }

    return {
      status: event.data.status || 'UNKNOWN',
      transactionId: event.data.transactionId,
    }
  }

  async getStatus(transactionId: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/v1/pix/${transactionId}`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    })

    if (!response.ok) {
      throw new Error(`OpenPix API error: ${response.status}`)
    }

    const data = await response.json()
    return data.status
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/health`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      })
      return response.ok
    } catch {
      return false
    }
  }
}