'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@/types'

export function useMatches(currentUserId: string | undefined) {
  const [matches, setMatches] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!currentUserId) {
      setLoading(false)
      return
    }

    const supabase = createClient()

    async function load() {
      const { data, error: rpcError } = await supabase
        .rpc('get_my_matches', { p_user_id: currentUserId })

      if (rpcError) {
        setError(rpcError.message)
      } else {
        setMatches(data ?? [])
      }
      setLoading(false)
    }

    load()

    const channel = supabase
      .channel(`matches-refresh-${currentUserId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'matches', filter: `user1_id=eq.${currentUserId}` }, load)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'matches', filter: `user2_id=eq.${currentUserId}` }, load)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [currentUserId])

  return { matches, loading, error }
}
