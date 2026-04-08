import tbLockup from '@/assets/tb-lockup.svg'

export function TrainingBuddyLogo({
  width = 65,
  height = 35,
}: { width?: number; height?: number } = {}) {
  return <img src={tbLockup} alt="Training Buddy" width={width} height={height} />
}
