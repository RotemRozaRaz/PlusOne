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

    async function load() {
      const supabase = createClient()
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
  }, [currentUserId])

  return { matches, loading, error }
}
