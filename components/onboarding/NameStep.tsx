'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'

interface Props {
  defaultValue: string
  onContinue: (name: string) => void
}

export default function NameStep({ defaultValue, onContinue }: Props) {
  const [name, setName] = useState(defaultValue)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (trimmed) onContinue(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <h2 className="font-display text-3xl text-slate-800 mb-1">What&apos;s your name?</h2>
        <p className="text-slate-400 text-sm">This is what other guests will see.</p>
      </div>
      <input
        autoFocus
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Your first name"
        className="w-full border-b-2 border-blush focus:border-gold outline-none bg-transparent text-xl font-body text-slate-800 py-2 transition-colors placeholder:text-slate-300"
      />
      <Button type="submit" disabled={!name.trim()} className="w-full">
        Continue →
      </Button>
    </form>
  )
}
