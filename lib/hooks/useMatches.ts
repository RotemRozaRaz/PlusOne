'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@/types'

export function useMatches(currentUserId: string | undefined) {
  const [matches, setMatches] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUserId) return

    async function load() {
      const supabase = createClient()

      const { data: matchRows } = await supabase
        .from('matches')
        .select('user1_id, user2_id')
        .or(`user1_id.eq.${currentUserId},user2_id.eq.${currentUserId}`)
        .order('created_at', { ascending: false })

      if (!matchRows || matchRows.length === 0) {
        setLoading(false)
        return
      }

      const otherIds = matchRows.map((m: { user1_id: string; user2_id: string }) =>
        m.user1_id === currentUserId ? m.user2_id : m.user1_id
      )

      const { data: users } = await supabase
        .from('users')
        .select('*')
        .in('id', otherIds)

      setMatches(users ?? [])
      setLoading(false)
    }

    load()
  }, [currentUserId])

  return { matches, loading }
}
