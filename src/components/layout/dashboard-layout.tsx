'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { TopBar } from '@/components/layout/topbar'
import { BottomNav } from '@/components/layout/bottom-nav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-bg">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col lg:ml-64">
        <TopBar onMenuToggle={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 lg:max-w-7xl lg:mx-auto lg:w-full">
          {children}
        </main>

        <BottomNav />
      </div>
    </div>
  )
}