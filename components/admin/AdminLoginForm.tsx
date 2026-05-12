'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'

export default function AdminLoginForm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.replace('/admin')
    } else {
      setError('Incorrect password')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh bg-ivory flex items-center justify-center px-6">
      <div className="w-full max-w-xs">
        <h1 className="font-display text-4xl text-slate-800 mb-2">Admin</h1>
        <p className="text-slate-400 text-sm mb-8">Plus One — Event Management</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            className="w-full border-b-2 border-blush focus:border-gold outline-none bg-transparent text-xl font-body text-slate-800 py-2 placeholder:text-slate-300"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" disabled={!password || loading} className="w-full mt-2">
            {loading ? <Spinner className="w-5 h-5 mx-auto" /> : 'Enter →'}
          </Button>
        </form>
      </div>
    </div>
  )
}
