'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Link as LinkIcon,
  Receipt,
  Wallet,
  ArrowDownToLine,
  Package,
  Key,
  Webhook,
  Shield,
  Bell,
  Settings,
  ChevronDown,
} from 'lucide-react'

const menuGroups = [
  {
    label: 'Principal',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/checkout', label: 'Link de Pagamento', icon: LinkIcon },
      { href: '/transactions', label: 'Transações', icon: Receipt },
    ],
  },
  {
    label: 'Financeiro',
    items: [
      { href: '/balance', label: 'Saldo', icon: Wallet },
      { href: '/withdraw', label: 'Saque', icon: ArrowDownToLine },
    ],
  },
  {
    label: 'Configurações',
    items: [
      { href: '/products', label: 'Produtos', icon: Package },
      {
        label: 'API',
        icon: Key,
        children: [
          { href: '/api-keys', label: 'API Keys', icon: Key },
          { href: '/webhooks', label: 'Webhooks', icon: Webhook },
        ],
      },
      { href: '/kyc', label: 'Compliance', icon: Shield },
      { href: '/notifications', label: 'Notificações', icon: Bell },
      { href: '/settings', label: 'Ajustes', icon: Settings },
    ],
  },
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
            {menuGroups.map((group) => (
              <li key={group.label}>
                <p className="px-4 py-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  {group.label}
                </p>
                <ul className="space-y-1 mt-1">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const active = pathname === item.href
                    if ('children' in item) {
                      return (
                        <li key={item.label}>
                          <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary">
                            <Icon className="w-5 h-5" />
                            <span>{item.label}</span>
                            <ChevronDown className="w-4 h-4 ml-auto" />
                          </div>
                          <ul className="ml-6 mt-1 space-y-1">
                            {(item as { children: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }[] }).children.map(
                              (child) => {
                                const ChildIcon = child.icon as React.ComponentType<{ className?: string }>
                                const childActive = pathname === child.href
                                return (
                                  <li key={child.href}>
                                    <Link
                                      href={child.href}
                                      onClick={onClose}
                                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                                        childActive
                                          ? 'bg-primary/10 text-primary'
                                          : 'text-text-secondary hover:text-text hover:bg-surface-elevated'
                                      }`}
                                    >
                                      <ChildIcon className="w-4 h-4" />
                                      {child.label}
                                    </Link>
                                  </li>
                                )
                              }
                            )}
                          </ul>
                        </li>
                      )
                    }
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
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}
