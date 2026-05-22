'use client'

import { useRef } from 'react'
import Link from 'next/link'
import SwipeCard, { type SwipeCardRef } from './SwipeCard'
import SwipeButtons from './SwipeButtons'
import type { User } from '@/types'

interface Props {
  profiles: User[]
  onSwipeEnd: (direction: 'left' | 'right', profileId: string) => void | Promise<void>
}

export default function CardStack({ profiles, onSwipeEnd }: Props) {
  const topCardRef = useRef<SwipeCardRef>(null)

  function handleSwipe(direction: 'left' | 'right', profileId: string) {
    onSwipeEnd(direction, profileId)
  }

  const visible = profiles.slice(0, 3)

  if (visible.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-8 py-16">
        <span className="text-5xl mb-4">🥂</span>
        <p className="font-display text-2xl text-slate-700 mb-2">All caught up!</p>
        <p className="text-slate-400 text-sm mb-6">
          You&apos;ve seen everyone here. Check the gallery!
        </p>
        <Link
          href="/singles"
          className="text-gold font-body font-semibold underline underline-offset-4"
        >
          Browse all singles →
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="relative w-full" style={{ aspectRatio: '3/4' }}>
        {[...visible].reverse().map((profile, i) => {
          const stackIndex = visible.length - 1 - i
          const isTop = stackIndex === 0
          return (
            <SwipeCard
              key={profile.id}
              ref={isTop ? topCardRef : undefined}
              profile={profile}
              isTop={isTop}
              stackIndex={stackIndex}
              onSwipe={direction => handleSwipe(direction, profile.id)}
            />
          )
        })}
      </div>

      <SwipeButtons
        isDisabled={visible.length === 0}
        onNope={() => topCardRef.current?.swipe('left')}
        onLike={() => topCardRef.current?.swipe('right')}
      />
    </div>
  )
}
