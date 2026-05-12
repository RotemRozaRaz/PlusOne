'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getOrCreateDeviceId } from '@/lib/deviceId'
import type { User } from '@/types'

export function useProfile() {
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const storedUserId = localStorage.getItem('plus_one_user_id')

      if (storedUserId) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', storedUserId)
          .single()
        setProfile(data ?? null)
      } else {
        const deviceId = getOrCreateDeviceId()
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('device_id', deviceId)
          .single()
        setProfile(data ?? null)
      }
      setLoading(false)
    }
    load()
  }, [])

  return { profile, loading }
}
