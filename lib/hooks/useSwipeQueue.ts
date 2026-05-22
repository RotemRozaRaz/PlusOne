'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@/types'

export function useSwipeQueue(currentUserId: string | undefined) {
  const [queue, setQueue] = useState<User[]>([])

  useEffect(() => {
    if (!currentUserId) return

    async function load() {
      const supabase = createClient()

      const [{ data: likes }, { data: dismissals }] = await Promise.all([
        supabase.from('likes').select('liked_id').eq('liker_id', currentUserId),
        supabase.from('dismissed').select('dismissed_id').eq('dismisser_id', currentUserId),
      ])

      const alreadySeen = new Set([
        ...(likes ?? []).map((l: { liked_id: string }) => l.liked_id),
        ...(dismissals ?? []).map((d: { dismissed_id: string }) => d.dismissed_id),
      ])

      const { data: profiles } = await supabase
        .from('users')
        .select('*')
        .eq('is_active', true)
        .neq('id', currentUserId)
        .order('created_at', { ascending: true })

      if (profiles) {
        setQueue(profiles.filter((p: User) => !alreadySeen.has(p.id)))
      }
    }

    load()
  }, [currentUserId])

  function markSeen(profileId: string) {
    setQueue(prev => prev.filter(p => p.id !== profileId))
  }

  return { queue, markSeen }
}
