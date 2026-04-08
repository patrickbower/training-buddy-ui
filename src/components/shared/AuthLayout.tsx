import { Outlet } from '@tanstack/react-router'
import { TrainingBuddyLogo } from './TrainingBuddyLogo'
import { TrainingBuddyIcon } from './TrainingBuddyIcon'
import { StravaLogo } from './StravaLogo'
import { ArrowRightArrowLeft } from '@gravity-ui/icons'

export function AuthLayout() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden bg-zinc-100">
      {/* Background photo — place auth-bg.jpg in /public for production */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[url('/auth-bg.jpg')] bg-cover bg-center opacity-50"
      />

      {/* Top branding */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-5 pt-10 text-center">
        <TrainingBuddyLogo width={150} />
        <p className="text-xl font-semibold leading-snug text-zinc-900">
          The running coach that learns you
        </p>
        <p className="text-base font-semibold text-zinc-900">
          Built around your runs. Sharpened by every conversation.
        </p>
      </div>

      {/* Page content (modal) */}
      <div className="relative z-10 flex w-full flex-1 items-center justify-center px-5 py-5">
        <Outlet />
      </div>

      {/* Strava trust badge */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-5 px-5 pb-5 text-center">
        <div className="flex items-center gap-2 rounded-full bg-white px-5 py-3 text-zinc-400">
          <TrainingBuddyIcon />
          <ArrowRightArrowLeft className="size-4" />
          <StravaLogo />
        </div>
        <span className="text-sm text-zinc-400 max-w-80">
          Training Buddy connects to Strava. We&apos;ll never see or store your login details.
        </span>
      </div>

      {/* Footer links */}
      <div className="relative z-10 flex gap-5 p-5">
        <button type="button" className="text-sm font-medium text-zinc-900">
          Terms of service
        </button>
        <button type="button" className="text-sm font-medium text-zinc-900">
          Privacy policy
        </button>
      </div>
    </div>
  )
}
