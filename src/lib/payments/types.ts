export interface PixProvider {
  createPayment(amount: number, pixKey: string, metadata?: Record<string, unknown>): Promise<{
    transactionId: string
    qrCodeUrl: string
    expiresAt: Date
  }>
  processWebhook(payload: unknown): Promise<{ status: string; transactionId?: string }>
  getStatus(transactionId: string): Promise<string>
  healthCheck(): Promise<boolean>
}