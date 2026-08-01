import { PixProvider } from './types'
import { OpenPixAdapter } from './openpix'
import { PagouAdapter } from './pagou'
import { prisma } from '@/lib/prisma/client'

export class MultiPay {
  private providers: Map<string, PixProvider> = new Map()

  async initialize(): Promise<void> {
    const providers = await prisma.provider.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { priority: 'asc' },
    })

    for (const provider of providers) {
      let adapter: PixProvider

      switch (provider.name.toLowerCase()) {
        case 'openpix':
          adapter = new OpenPixAdapter(provider.apiKey, provider.baseUrl)
          break
        case 'pagou':
        case 'akkadpag':
          adapter = new PagouAdapter(
            provider.publicKey,
            provider.secretKey,
            provider.baseUrl
          )
          break
        default:
          continue
      }

      this.providers.set(provider.id, adapter)
    }
  }

  async createPayment(
    amount: number,
    pixKey: string,
    metadata?: Record<string, unknown>
  ): Promise<{ transactionId: string; qrCodeUrl: string; expiresAt: Date }> {
    for (const [, provider] of this.providers) {
      try {
        const health = await provider.healthCheck()
        if (!health) continue

        return await provider.createPayment(amount, pixKey, metadata)
      } catch {
        continue
      }
    }

    throw new Error('No available payment provider')
  }

  async processWebhook(providerId: string, payload: unknown): Promise<{ status: string; transactionId?: string }> {
    const provider = this.providers.get(providerId)
    if (!provider) {
      throw new Error(`Provider ${providerId} not found`)
    }

    return provider.processWebhook(payload)
  }

  async getStatus(transactionId: string): Promise<string> {
    for (const [, provider] of this.providers) {
      try {
        return await provider.getStatus(transactionId)
      } catch {
        continue
      }
    }

    throw new Error('No available payment provider')
  }
}

export const multipay = new MultiPay()
