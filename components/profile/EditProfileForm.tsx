'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import type { User } from '@/types'

const VALID_IG = /^[a-zA-Z0-9._]{1,30}$/
const VALID_PHONE = /^[+\d][\d\s\-().]{6,19}$/

interface Props {
  profile: User
  onSaved: (updated: User) => void
}

export default function EditProfileForm({ profile, onSaved }: Props) {
  const [name, setName] = useState(profile.name)
  const [instagram, setInstagram] = useState(profile.instagram ?? '')
  const [phone, setPhone] = useState(profile.phone ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const igTrimmed = instagram.trim().replace(/^@/, '')
  const phoneTrimmed = phone.trim()

  function validate(): string | null {
    if (!name.trim()) return 'Name is required.'
    if (igTrimmed && !VALID_IG.test(igTrimmed)) return 'Invalid Instagram handle (letters, numbers, . and _ only, max 30 chars).'
    if (phoneTrimmed && !VALID_PHONE.test(phoneTrimmed)) return 'Invalid phone number.'
    if (!igTrimmed && !phoneTrimmed) return 'Please keep at least an Instagram handle or phone number.'
    return null
  }

  async function handleSave() {
    const validationError = validate()
    if (validationError) { setError(validationError); return }

    setSaving(true)
    setError(null)
    setSaved(false)

    const supabase = createClient()
    const { data, error: updateError } = await supabase
      .from('users')
      .update({
        name: name.trim(),
        instagram: igTrimmed || null,
        phone: phoneTrimmed || null,
      })
      .eq('id', profile.id)
      .select()
      .single()

    setSaving(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setSaved(true)
    onSaved(data as User)
    setTimeout(() => setSaved(false), 3000)
  }

  const dirty =
    name.trim() !== profile.name ||
    igTrimmed !== (profile.instagram ?? '') ||
    phoneTrimmed !== (profile.phone ?? '')

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-display text-xl text-slate-700">Edit profile</h2>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400 font-body uppercase tracking-wide">Name</label>
        <input
          type="text"
          value={name}
          onChange={e => { setName(e.target.value); setError(null); setSaved(false) }}
          className="border-b-2 border-blush focus:border-gold outline-none bg-transparent text-lg font-body text-slate-800 py-1 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400 font-body uppercase tracking-wide">Instagram</label>
        <div className="flex items-center border-b-2 border-blush focus-within:border-gold transition-colors">
          <span className="text-slate-400 mr-1">@</span>
          <input
            type="text"
            value={instagram}
            onChange={e => { setInstagram(e.target.value.trim().replace(/^@/, '')); setError(null); setSaved(false) }}
            placeholder="yourhandle"
            className="flex-1 outline-none bg-transparent text-lg font-body text-slate-800 py-1"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400 font-body uppercase tracking-wide">Phone</label>
        <input
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={e => { setPhone(e.target.value.trimStart()); setError(null); setSaved(false) }}
          placeholder="+1 234 567 8900"
          className="border-b-2 border-blush focus:border-gold outline-none bg-transparent text-lg font-body text-slate-800 py-1 transition-colors"
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {saved && <p className="text-green-500 text-sm">Saved!</p>}

      <Button onClick={handleSave} disabled={saving || !dirty} className="w-full">
        {saving ? 'Saving…' : 'Save changes'}
      </Button>
    </div>
  )
}
