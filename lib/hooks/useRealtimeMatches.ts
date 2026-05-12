'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useRealtimeMatches(
  currentUserId: string | undefined,
  onMatch: (matchedUserId: string) => void
) {
  const onMatchRef = useRef(onMatch)
  onMatchRef.current = onMatch

  useEffect(() => {
    if (!currentUserId) return

    const supabase = createClient()

    const channel = supabase
      .channel(`user-matches-${currentUserId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'matches',
          filter: `user1_id=eq.${currentUserId}`,
        },
        (payload) => {
          const m = payload.new as { user1_id: string; user2_id: string }
          onMatchRef.current(m.user2_id)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'matches',
          filter: `user2_id=eq.${currentUserId}`,
        },
        (payload) => {
          const m = payload.new as { user1_id: string; user2_id: string }
          onMatchRef.current(m.user1_id)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUserId])
}
