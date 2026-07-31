'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/products', label: 'Produtos', icon: '📦' },
  { href: '/checkout', label: 'Receber Pix', icon: '💰' },
  { href: '/transactions', label: 'Transações', icon: '📋' },
  { href: '/balance', label: 'Saldo', icon: '💳' },
  { href: '/withdraw', label: 'Saque', icon: '🏦' },
  { href: '/kyc', label: 'Compliance', icon: '🛡️' },
  { href: '/notifications', label: 'Notificações', icon: '🔔' },
]

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname()

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-full w-64 bg-surface border-r border-white/5 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-bg font-display font-bold text-lg">S</span>
          </div>
          <span className="font-display font-bold text-xl text-text">SwiftPay</span>
        </div>

        <nav className="py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-secondary hover:text-text hover:bg-surface-elevated'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}