'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getOrCreateDeviceId } from '@/lib/deviceId'
import { createClient } from '@/lib/supabase/client'
import Spinner from '@/components/ui/Spinner'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    async function check() {
      const deviceId = getOrCreateDeviceId()
      const supabase = createClient()
      const { data } = await supabase
        .from('users')
        .select('id')
        .eq('device_id', deviceId)
        .maybeSingle()

      router.replace(data ? '/swipe' : '/onboard')
    }
    check()
  }, [router])

  return (
    <div className="min-h-dvh flex items-center justify-center bg-ivory">
      <div className="text-center">
        <h1 className="font-display text-5xl text-slate-800 mb-3">Plus One</h1>
        <Spinner />
      </div>
    </div>
  )
}
