'use client'

import { forwardRef, useImperativeHandle } from 'react'
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  type PanInfo,
} from 'framer-motion'
import type { User } from '@/types'

export interface SwipeCardRef {
  swipe: (direction: 'left' | 'right') => void
}

interface Props {
  profile: User
  onSwipe: (direction: 'left' | 'right') => void
  isTop: boolean
  stackIndex: number
}

const SWIPE_THRESHOLD_OFFSET = 100
const SWIPE_THRESHOLD_VELOCITY = 400

const SwipeCard = forwardRef<SwipeCardRef, Props>(
  ({ profile, onSwipe, isTop, stackIndex }, ref) => {
    const x = useMotionValue(0)
    const rotate = useTransform(x, [-200, 0, 200], [-18, 0, 18])
    const likeOpacity = useTransform(x, [20, 90], [0, 1], { clamp: true })
    const nopeOpacity = useTransform(x, [-90, -20], [1, 0], { clamp: true })

    const scale = [1, 0.96, 0.92][stackIndex] ?? 0.92
    const yOffset = [0, 14, 28][stackIndex] ?? 28

    useImperativeHandle(ref, () => ({
      async swipe(direction: 'left' | 'right') {
        const exitX = direction === 'right' ? 700 : -700
        await animate(x, exitX, { duration: 0.28 })
        onSwipe(direction)
        x.set(0)
      },
    }))

    async function handleDragEnd(_: unknown, info: PanInfo) {
      const { velocity, offset } = info
      const goRight =
        velocity.x > SWIPE_THRESHOLD_VELOCITY || offset.x > SWIPE_THRESHOLD_OFFSET
      const goLeft =
        velocity.x < -SWIPE_THRESHOLD_VELOCITY || offset.x < -SWIPE_THRESHOLD_OFFSET

      if (goRight) {
        await animate(x, 700, { duration: 0.28 })
        onSwipe('right')
      } else if (goLeft) {
        await animate(x, -700, { duration: 0.28 })
        onSwipe('left')
      } else {
        animate(x, 0, { type: 'spring', stiffness: 300, damping: 25 })
      }
    }

    return (
      <motion.div
        className="absolute inset-0"
        style={{
          x: isTop ? x : 0,
          rotate: isTop ? rotate : 0,
          zIndex: 10 - stackIndex,
        }}
        animate={{ scale, y: yOffset }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        drag={isTop ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.85}
        onDragEnd={isTop ? handleDragEnd : undefined}
      >
        <div className="relative w-full h-full rounded-card overflow-hidden shadow-card-lg select-none">
          <img
            src={profile.photo_url}
            alt={profile.name}
            className="w-full h-full object-cover pointer-events-none"
            draggable={false}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 pb-8 text-white">
            <h2 className="font-display text-3xl font-semibold leading-tight">
              {profile.name}
            </h2>
            {profile.instagram && (
              <p className="text-white/70 text-sm mt-1">@{profile.instagram}</p>
            )}
          </div>

          {isTop && (
            <>
              <motion.div
                className="absolute top-8 left-5 border-4 border-emerald-400 rounded-xl px-3 py-1 -rotate-12"
                style={{ opacity: likeOpacity }}
              >
                <span className="text-emerald-400 font-body font-black text-2xl tracking-widest">
                  LIKE
                </span>
              </motion.div>

              <motion.div
                className="absolute top-8 right-5 border-4 border-red-400 rounded-xl px-3 py-1 rotate-12"
                style={{ opacity: nopeOpacity }}
              >
                <span className="text-red-400 font-body font-black text-2xl tracking-widest">
                  NOPE
                </span>
              </motion.div>
            </>
          )}
        </div>
      </motion.div>
    )
  }
)

SwipeCard.displayName = 'SwipeCard'
export default SwipeCard
