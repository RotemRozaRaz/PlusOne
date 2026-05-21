'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'

interface Props {
  defaultValue: string
  onContinue: (handle: string) => void
  onSkip: () => void
}

const VALID_IG = /^[a-zA-Z0-9._]{1,30}$/

export default function InstagramStep({ defaultValue, onContinue, onSkip }: Props) {
  const [handle, setHandle] = useState(defaultValue)
  const [error, setError] = useState<string | null>(null)

  function handleChange(val: string) {
    setHandle(val.trim().replace(/^@/, ''))
    setError(null)
  }

  function handleContinue() {
    if (handle && !VALID_IG.test(handle)) {
      setError('Only letters, numbers, . and _ allowed (max 30 chars)')
      return
    }
    onContinue(handle)
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-display text-3xl text-slate-800 mb-1">Instagram handle?</h2>
        <p className="text-slate-400 text-sm">Optional — lets matches find you easily.</p>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center border-b-2 border-blush focus-within:border-gold transition-colors">
          <span className="text-slate-400 text-xl mr-1">@</span>
          <input
            autoFocus
            type="text"
            inputMode="url"
            value={handle}
            onChange={e => handleChange(e.target.value)}
            placeholder="yourhandle"
            className="flex-1 outline-none bg-transparent text-xl font-body text-slate-800 py-2 placeholder:text-slate-300"
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
      <Button onClick={handleContinue} className="w-full">
        Continue →
      </Button>
      <button
        type="button"
        onClick={onSkip}
        className="text-slate-400 text-sm underline underline-offset-2 text-center"
      >
        Skip for now
      </button>
    </div>
  )
}
