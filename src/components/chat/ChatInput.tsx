import { useState } from 'react'
import { Button, InputGroup, TextField } from '@heroui/react'
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
      <TextField aria-label="message" className="w-full">
        <InputGroup
          fullWidth
          className="h-13 rounded-4xl border-zinc-100 bg-white px-4 py-3 shadow-sm [&:has(input:focus)]:ring-0 [&:has(input:focus)]:shadow-md "
        >
          <InputGroup.Input
            placeholder="Ask anything"
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
            }}
            onKeyDown={handleKeyDown}
            className="text-zinc-900 placeholder:text-zinc-500"
          />
          <InputGroup.Suffix className="pr-0">
            <Button
              isIconOnly
              size="sm"
              variant="tertiary"
              aria-label="Send"
              onPress={handleSend}
              className="rounded-2xl shrink-0"
            >
              <ArrowUp width={16} height={16} />
            </Button>
          </InputGroup.Suffix>
        </InputGroup>
      </TextField>
      <p className="text-xs text-zinc-400 text-center">
        Training Buddy is an AI model. Always verify critical information.
      </p>
    </div>
  )
}
