import { useState } from 'react'
import { Outlet } from '@tanstack/react-router'
import { Drawer, Button } from '@heroui/react'
import { Bars } from '@gravity-ui/icons'
import { Sidebar } from './Sidebar'

export function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="flex h-screen bg-zinc-100">
      {/* Desktop sidebar — hidden on mobile */}
      <aside className="hidden md:flex w-60 shrink-0 bg-zinc-100">
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      <Drawer.Backdrop isOpen={drawerOpen} onOpenChange={setDrawerOpen} className="md:hidden">
        <Drawer.Content placement="left" className="w-60 max-w-60">
          <Drawer.Dialog aria-label="Navigation">
            <Drawer.Body className="p-0">
              <Sidebar
                onMenuToggle={() => {
                  setDrawerOpen(false)
                }}
              />
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>

      <main className="flex-1 overflow-y-auto bg-white flex flex-col">
        {/* Mobile header with menu toggle */}
        <div className="md:hidden flex items-center h-12 px-4 bg-white border-b border-zinc-100 shrink-0">
          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            aria-label="Open menu"
            onPress={() => {
              setDrawerOpen(true)
            }}
          >
            <Bars width={16} height={16} />
          </Button>
        </div>
        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
