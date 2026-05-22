'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'

interface Props {
  defaultInstagram: string
  defaultPhone: string
  onContinue: (handle: string) => void
  onContinuePhone: (phone: string) => void
}

const VALID_IG = /^[a-zA-Z0-9._]{1,30}$/
const VALID_PHONE = /^[+\d][\d\s\-().]{6,19}$/

export default function InstagramStep({ defaultInstagram, defaultPhone, onContinue, onContinuePhone }: Props) {
  const [mode, setMode] = useState<'instagram' | 'phone'>(defaultPhone ? 'phone' : 'instagram')
  const [handle, setHandle] = useState(defaultInstagram)
  const [phone, setPhone] = useState(defaultPhone)
  const [error, setError] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  function handleHandleChange(val: string) {
    setHandle(val.trim().replace(/^@/, ''))
    setError(null)
  }

  function handlePhoneChange(val: string) {
    setPhone(val.trimStart())
    setError(null)
  }

  async function handleBlur() {
    const supabase = createClient()
    if (mode === 'instagram') {
      if (!handle || !VALID_IG.test(handle)) return
      setIsChecking(true)
      const { data } = await supabase
        .from('users').select('id').eq('instagram', handle.toLowerCase()).maybeSingle()
      if (data) setError('This Instagram handle is already registered.')
    } else {
      if (!phone || !VALID_PHONE.test(phone)) return
      setIsChecking(true)
      const { data } = await supabase
        .from('users').select('id').eq('phone', phone.trim()).maybeSingle()
      if (data) setError('This phone number is already registered.')
    }
    setIsChecking(false)
  }

  function handleContinue() {
    if (mode === 'instagram') {
      if (!handle) { setError('Please enter your Instagram handle.'); return }
      if (!VALID_IG.test(handle)) { setError('Only letters, numbers, . and _ allowed (max 30 chars)'); return }
      if (error) return
      onContinue(handle)
    } else {
      if (!phone) { setError('Please enter your phone number.'); return }
      if (!VALID_PHONE.test(phone)) { setError('Please enter a valid phone number.'); return }
      if (error) return
      onContinuePhone(phone)
    }
  }

  function switchMode(next: 'instagram' | 'phone') {
    setMode(next)
    setError(null)
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-display text-3xl text-slate-800 mb-1">
          {mode === 'instagram' ? 'Instagram handle?' : 'Phone number?'}
        </h2>
        <p className="text-slate-400 text-sm">
          {mode === 'instagram'
            ? 'So your match can find you on Instagram.'
            : 'So your match can reach you.'}
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center border-b-2 border-blush focus-within:border-gold transition-colors">
          {mode === 'instagram' && (
            <span className="text-slate-400 text-xl mr-1">@</span>
          )}
          <input
            autoFocus
            type={mode === 'phone' ? 'tel' : 'text'}
            inputMode={mode === 'phone' ? 'tel' : 'url'}
            value={mode === 'instagram' ? handle : phone}
            onChange={e => mode === 'instagram' ? handleHandleChange(e.target.value) : handlePhoneChange(e.target.value)}
            onBlur={handleBlur}
            placeholder={mode === 'instagram' ? 'yourhandle' : '+1 234 567 8900'}
            className="flex-1 outline-none bg-transparent text-xl font-body text-slate-800 py-2 placeholder:text-slate-300"
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>

      <Button onClick={handleContinue} disabled={isChecking || !!error} className="w-full">
        {isChecking ? 'Checking…' : 'Continue →'}
      </Button>

      <button
        type="button"
        onClick={() => switchMode(mode === 'instagram' ? 'phone' : 'instagram')}
        className="text-slate-400 text-sm underline underline-offset-2 text-center"
      >
        {mode === 'instagram' ? "I don't have Instagram — use phone instead" : 'Use Instagram instead'}
      </button>
    </div>
  )
}
