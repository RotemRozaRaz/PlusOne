'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@/types'

export type LikedUser = User & { isMatch: boolean }

export function useLikes(currentUserId: string | undefined) {
  const [likes, setLikes] = useState<LikedUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!currentUserId) {
      setLoading(false)
      return
    }

    async function load() {
      const supabase = createClient()

      const [{ data: likeRows, error: likesError }, { data: matchRows, error: matchesError }] =
        await Promise.all([
          supabase
            .from('likes')
            .select('liked_id, users!liked_id(*)')
            .eq('liker_id', currentUserId)
            .order('created_at', { ascending: false }),
          supabase
            .from('matches')
            .select('user1_id, user2_id')
            .or(`user1_id.eq.${currentUserId},user2_id.eq.${currentUserId}`),
        ])

      if (likesError || matchesError) {
        setError((likesError ?? matchesError)!.message)
        setLoading(false)
        return
      }

      const matchedIds = new Set(
        (matchRows ?? []).map(m =>
          m.user1_id === currentUserId ? m.user2_id : m.user1_id
        )
      )

      const result: LikedUser[] = (likeRows ?? [])
        .map((row: { liked_id: string; users: unknown }) => {
          const user = row.users as User
          return { ...user, isMatch: matchedIds.has(user.id) }
        })

      setLikes(result)
      setLoading(false)
    }

    load()
  }, [currentUserId])

  return { likes, loading, error }
}
