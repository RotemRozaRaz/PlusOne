'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginStep({ onBack }: { onBack: () => void }) {
  const [handle, setHandle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSignIn() {
    const normalized = handle.trim().replace(/^@/, '').toLowerCase()
    if (!normalized) return
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data } = await supabase
      .from('users')
      .select('id')
      .eq('instagram', normalized)
      .eq('is_active', true)
      .single()

    if (data) {
      localStorage.setItem('plus_one_user_id', data.id)
      window.location.href = '/swipe'
    } else {
      setError(`No profile found for @${normalized}. Did you use a different handle?`)
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="block text-sm text-slate-500 mb-1">Instagram handle</label>
        <div className="flex items-center border border-slate-200 rounded-xl px-3 bg-white">
          <span className="text-slate-400 mr-1 select-none">@</span>
          <input
            type="text"
            value={handle}
            onChange={e => setHandle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSignIn()}
            placeholder="yourhandle"
            className="flex-1 py-3 bg-transparent outline-none text-slate-800 placeholder:text-slate-300"
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
          />
        </div>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>

      <button
        onClick={handleSignIn}
        disabled={loading || !handle.trim()}
        className="w-full py-3 rounded-xl bg-gold text-white font-medium disabled:opacity-50 transition-opacity"
      >
        {loading ? 'Looking up…' : 'Sign In'}
      </button>

      <button
        onClick={onBack}
        className="text-sm text-slate-400 hover:text-slate-600 transition-colors text-center"
      >
        ← Create a new profile
      </button>
    </div>
  )
}
