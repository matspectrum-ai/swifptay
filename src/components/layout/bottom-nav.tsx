'use client'

import Link from 'next/link'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/products', label: 'Produtos', icon: '📦' },
  { href: '/checkout', label: 'Receber', icon: '💰' },
  { href: '/balance', label: 'Saldo', icon: '💳' },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-surface/90 backdrop-blur-md border-t border-white/5 lg:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-1 px-3 py-1.5 text-text-secondary hover:text-primary transition-colors"
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}