import { Outlet } from '@tanstack/react-router'
import { Link } from '@heroui/react'
import { TrainingBuddyLogo } from './TrainingBuddyLogo'
import runnerBg from '@/assets/runner-bg.jpg'

export function AuthLayout() {
  return (
    <div className="flex h-screen">
      {/* Left panel */}
      <div className="flex h-full w-full flex-col bg-white md:w-1/2 items-center py-5">
        <div className="max-w-xs flex flex-col gap-4 h-full">
          <div className="flex-1 flex items-center justify-center">
            <TrainingBuddyLogo width={260} />
          </div>
          <div className="flex-1">
            <Outlet />
          </div>
          <div className="flex-1 flex items-end justify-center gap-16">
            <Link href="#" className="text-sm text-zinc-500 no-underline">
              Terms of service
            </Link>
            <Link href="#" className="text-sm text-zinc-500 no-underline">
              Privacy policy
            </Link>
          </div>
        </div>
      </div>

      {/* Right panel — hidden on mobile */}
      <div className="hidden md:block md:w-1/2 overflow-hidden">
        <img src={runnerBg} alt="" aria-hidden="true" className="h-full w-full object-cover" />
      </div>
    </div>
  )
}
