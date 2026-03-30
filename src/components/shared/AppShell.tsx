import { Outlet } from '@tanstack/react-router'
import { Sidebar } from './Sidebar'

export function AppShell() {
  return (
    <div className="flex h-screen bg-[#f5f5f5]">
      <aside className="hidden md:flex w-[223px] shrink-0 bg-[#f5f5f5]">
        <Sidebar />
      </aside>
      <main className="flex-1 overflow-hidden bg-white">
        <Outlet />
      </main>
    </div>
  )
}
