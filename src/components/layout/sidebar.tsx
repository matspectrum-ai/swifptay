'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Wallet,
  ArrowLeftRight,
  CreditCard,
  ArrowDownToLine,
  Shield,
  Bell,
  Settings,
  Key,
  Webhook,
} from 'lucide-react'

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/products', label: 'Produtos', icon: Package },
  { href: '/checkout', label: 'Receber Pix', icon: Wallet },
  { href: '/transactions', label: 'Transações', icon: ArrowLeftRight },
  { href: '/balance', label: 'Saldo', icon: CreditCard },
  { href: '/withdraw', label: 'Saque', icon: ArrowDownToLine },
  { href: '/kyc', label: 'Compliance', icon: Shield },
  { href: '/notifications', label: 'Notificações', icon: Bell },
  { href: '/api-keys', label: 'API Keys', icon: Key },
  { href: '/webhooks', label: 'Webhooks', icon: Webhook },
]

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname()

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-full w-64 bg-surface transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 px-6 py-5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-bg font-display font-bold text-lg">S</span>
          </div>
          <span className="font-display font-bold text-xl text-text">SwiftPay</span>
        </div>

        <nav className="py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-text-secondary hover:text-text hover:bg-surface-elevated'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    </>
  )
}
