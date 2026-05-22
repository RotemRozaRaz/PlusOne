'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import CardStack from '@/components/swipe/CardStack'
import MatchOverlay from '@/components/swipe/MatchOverlay'
import BottomNav from '@/components/BottomNav'
import Spinner from '@/components/ui/Spinner'
import { useProfile } from '@/lib/hooks/useProfile'
import { useSwipeQueue } from '@/lib/hooks/useSwipeQueue'
import { useRealtimeMatches } from '@/lib/hooks/useRealtimeMatches'
import { createClient } from '@/lib/supabase/client'
import LogoutButton from '@/components/ui/LogoutButton'
import type { User } from '@/types'

export default function SwipePage() {
  const router = useRouter()
  const { profile, loading } = useProfile()
  const { queue, markSeen } = useSwipeQueue(profile?.id)
  const [currentMatch, setCurrentMatch] = useState<User | null>(null)

  useRealtimeMatches(profile?.id, async (matchedUserId) => {
    const supabase = createClient()
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', matchedUserId)
      .single()
    if (data) setCurrentMatch(data)
  })

  useEffect(() => {
    if (!loading && !profile) router.replace('/onboard')
  }, [profile, loading, router])

  async function handleSwipeEnd(direction: 'left' | 'right', profileId: string) {
    markSeen(profileId)
    const supabase = createClient()
    if (direction === 'right' && profile) {
      const { error } = await supabase.rpc('try_create_match', { p_liker: profile.id, p_liked: profileId })
      if (error) console.error('like failed:', error)
    } else if (direction === 'left' && profile) {
      const { error } = await supabase.from('dismissed').insert({ dismisser_id: profile.id, dismissed_id: profileId })
      if (error) console.error('dismissed insert failed:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-ivory">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-ivory flex flex-col pb-20">
      <header className="px-6 pt-safe pb-3 flex items-center justify-between">
        <h1 className="font-display text-3xl text-slate-800">Plus One</h1>
        <LogoutButton />
      </header>

      <main className="flex-1 px-5 flex items-start justify-center">
        {profile && (
          <CardStack profiles={queue} onSwipeEnd={handleSwipeEnd} />
        )}
      </main>

      <BottomNav active="swipe" />

      <AnimatePresence>
        {currentMatch && profile && (
          <MatchOverlay
            currentUser={profile}
            matchedUser={currentMatch}
            onDismiss={() => setCurrentMatch(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
