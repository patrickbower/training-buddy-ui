import { toast } from '@/lib/toast'

export function onMutationError(error: unknown): void {
  const message = error instanceof Error ? error.message : 'Something went wrong'
  toast.error(message)
}
