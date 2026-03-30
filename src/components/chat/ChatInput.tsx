import { useState } from 'react'
import { Button } from '@heroui/react'
import { ArrowUp } from '@gravity-ui/icons'

interface ChatInputProps {
  onSend: (message: string) => void
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [value, setValue] = useState('')

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    onSend(trimmed)
    setValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col gap-2 w-full px-3">
      <div className="flex items-center gap-2 h-[52px] px-4 py-3 rounded-[24px] bg-white border border-[#f5f5f5] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.04),0px_1px_2px_0px_rgba(0,0,0,0.06),0px_0px_1px_0px_rgba(0,0,0,0.06)]">
        <input
          type="text"
          aria-label="message"
          placeholder="Ask anything"
          value={value}
          onChange={(e) => { setValue(e.target.value); }}
          onKeyDown={handleKeyDown}
          className="flex-1 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none bg-transparent"
        />
        <Button
          isIconOnly
          size="sm"
          variant="secondary"
          aria-label="Send"
          onPress={handleSend}
          className="rounded-2xl shrink-0"
        >
          <ArrowUp width={16} height={16} />
        </Button>
      </div>
      <p className="text-[10px] text-zinc-400 text-center">
        Training Buddy is an AI model. Always verify critical information.
      </p>
    </div>
  )
}
