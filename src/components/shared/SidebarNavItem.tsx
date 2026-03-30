import { Link } from '@tanstack/react-router'

interface SidebarNavItemProps {
  href: string
  icon: React.ReactNode
  title: string
  subtitle: string
}

export function SidebarNavItem({ href, icon, title, subtitle }: SidebarNavItemProps) {
  return (
    <Link
      to={href as '/plan'}
      className="flex gap-3 items-center min-h-9 px-3 py-1.5 rounded-[20px] w-full text-left no-underline hover:bg-default"
      activeProps={{ className: 'bg-[#ebebec]' }}
    >
      <span className="shrink-0 text-zinc-500 pt-px">{icon}</span>
      <span className="flex flex-col min-w-0">
        <span className="text-sm font-medium text-zinc-900 leading-snug truncate">{title}</span>
        <span className="text-xs text-zinc-500 leading-snug truncate">{subtitle}</span>
      </span>
    </Link>
  )
}
