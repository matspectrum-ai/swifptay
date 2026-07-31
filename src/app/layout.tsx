import type { Metadata } from 'next'
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-body' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['700', '800'], variable: '--font-display' })
const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'SwiftPay — Pagamentos instantâneos',
  description: 'Plataforma fintech para recebimento de pagamentos Pix',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable} font-body bg-bg text-text antialiased`}>
        {children}
      </body>
    </html>
  )
}