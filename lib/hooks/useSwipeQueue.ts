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

      const { data: likes } = await supabase
        .from('likes')
        .select('liked_id')
        .eq('liker_id', currentUserId)

      const alreadyLiked = new Set((likes ?? []).map((l: { liked_id: string }) => l.liked_id))

      const { data: profiles } = await supabase
        .from('users')
        .select('*')
        .eq('is_active', true)
        .neq('id', currentUserId)
        .order('created_at', { ascending: true })

      if (profiles) {
        setQueue(profiles.filter((p: User) => !alreadyLiked.has(p.id)))
      }
    }

    load()
  }, [currentUserId])

  function markSeen(profileId: string) {
    setQueue(prev => prev.filter(p => p.id !== profileId))
  }

  return { queue, markSeen }
}
