'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import BottomNav from '@/components/BottomNav'
import Avatar from '@/components/ui/Avatar'
import Spinner from '@/components/ui/Spinner'
import { useProfile } from '@/lib/hooks/useProfile'
import { useMatches } from '@/lib/hooks/useMatches'
import LogoutButton from '@/components/ui/LogoutButton'

export default function MatchesPage() {
  const router = useRouter()
  const { profile, loading: profileLoading } = useProfile()
  const { matches, loading: matchesLoading, error: matchesError } = useMatches(profile?.id)

  useEffect(() => {
    if (!profileLoading && !profile) router.replace('/onboard')
  }, [profile, profileLoading, router])

  const loading = profileLoading || matchesLoading

  return (
    <div className="min-h-dvh bg-ivory flex flex-col pb-20">
      <header className="px-5 pt-safe pb-3 border-b border-blush/40">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl text-slate-800">Your Matches</h1>
          <LogoutButton />
        </div>
        {!loading && matches.length > 0 && (
          <p className="text-slate-400 text-xs mt-0.5 font-body">
            {matches.length} {matches.length === 1 ? 'match' : 'matches'} 💍
          </p>
        )}
      </header>

      <main className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Spinner />
          </div>
        ) : matchesError ? (
          <p className="text-red-400 text-sm text-center px-8 pt-8">{matchesError}</p>
        ) : matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
            <span className="text-5xl mb-4">💌</span>
            <p className="font-display text-2xl text-slate-700 mb-2">No matches yet</p>
            <p className="text-slate-400 text-sm">
              Keep swiping — your match is out there!
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-blush/40">
            {matches.map(match => (
              <li key={match.id} className="flex items-center gap-4 px-5 py-4">
                <Avatar src={match.photo_url} name={match.name} size={56} />
                <div className="flex-1 min-w-0">
                  <p className="font-body font-semibold text-slate-800 truncate">
                    {match.name}
                  </p>
                  {match.instagram ? (
                    <a
                      href={`https://instagram.com/${match.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold text-sm"
                    >
                      @{match.instagram} ↗
                    </a>
                  ) : match.phone ? (
                    <span className="text-slate-500 text-sm">{match.phone}</span>
                  ) : null}
                </div>
                <span className="text-2xl">💍</span>
              </li>
            ))}
          </ul>
        )}
      </main>

      <BottomNav active="matches" />
    </div>
  )
}
