'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Link as LinkIcon,
  Receipt,
  Wallet,
  Settings,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Início', icon: LayoutDashboard },
  { href: '/checkout', label: 'Link', icon: LinkIcon },
  { href: '/transactions', label: 'Transações', icon: Receipt },
  { href: '/balance', label: 'Saldo', icon: Wallet },
  { href: '/settings', label: 'Ajustes', icon: Settings },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-surface/90 backdrop-blur-md border-t border-white/5 lg:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                active ? 'text-primary' : 'text-text-secondary hover:text-text'
              }`}
            >
              {active && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(124,252,0,0.6)]" />
              )}
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
