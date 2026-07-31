'use client'

import { useState } from 'react'
import Link from 'next/link'

export function TopBar({ onMenuToggle }: { onMenuToggle: () => void }) {
  const [notifications] = useState(3)

  return (
    <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text hover:bg-surface-elevated"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="relative hidden sm:block">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              placeholder="Pesquisar..."
              className="pl-10 pr-4 py-2 bg-surface-elevated border border-white/5 rounded-lg text-sm text-text placeholder:text-text-secondary/50 focus:outline-none focus:border-primary/50 w-64"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-lg text-text-secondary hover:text-text hover:bg-surface-elevated" aria-label="Notifications">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-bg text-xs font-bold rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>

          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
            <span className="text-primary font-display font-bold text-sm">U</span>
          </div>
        </div>
      </div>
    </header>
  )
}