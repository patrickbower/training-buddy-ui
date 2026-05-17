import { Outlet } from '@tanstack/react-router'
import { Link } from '@heroui/react'
import { TrainingBuddyLogo } from './TrainingBuddyLogo'
import runnerBg from '@/assets/runner-bg.jpg'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="flex w-full flex-col bg-white md:w-1/2">
        <div className="p-6">
          <TrainingBuddyLogo width={120} />
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-8">
          <div className="w-full max-w-xs">
            <Outlet />
          </div>
        </div>

        <div className="flex justify-center gap-5 p-5">
          <Link href="#" className="text-sm font-medium text-zinc-500 no-underline">
            Terms of service
          </Link>
          <Link href="#" className="text-sm font-medium text-zinc-500 no-underline">
            Privacy policy
          </Link>
        </div>
      </div>

      {/* Right panel — hidden on mobile */}
      <div className="hidden md:block md:w-1/2 overflow-hidden">
        <img src={runnerBg} alt="" aria-hidden="true" className="h-full w-full object-cover" />
      </div>
    </div>
  )
}
