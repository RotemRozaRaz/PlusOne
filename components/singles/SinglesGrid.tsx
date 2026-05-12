'use client'

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import ProfileCard from './ProfileCard'
import ProfileModal from './ProfileModal'
import type { User } from '@/types'

interface Props {
  profiles: User[]
}

export default function SinglesGrid({ profiles }: Props) {
  const [selected, setSelected] = useState<User | null>(null)

  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-8">
        <span className="text-5xl mb-4">🎊</span>
        <p className="font-display text-2xl text-slate-700 mb-2">
          Be the first to join!
        </p>
        <p className="text-slate-400 text-sm">
          No guests have signed up yet. Scan the QR code to be the first.
        </p>
      </div>
    )
  }

  const left = profiles.filter((_, i) => i % 2 === 0)
  const right = profiles.filter((_, i) => i % 2 === 1)

  return (
    <>
      <div className="flex gap-3 px-4 pb-24">
        <div className="flex-1 flex flex-col gap-3">
          {left.map((profile, i) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              index={i * 2}
              onClick={() => setSelected(profile)}
            />
          ))}
        </div>
        <div className="flex-1 flex flex-col gap-3 pt-6">
          {right.map((profile, i) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              index={i * 2 + 1}
              onClick={() => setSelected(profile)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <ProfileModal
            profile={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
