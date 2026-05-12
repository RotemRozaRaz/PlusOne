'use client'

import { motion } from 'framer-motion'

interface Props {
  onLike: () => void
  onNope: () => void
  isDisabled: boolean
}

export default function SwipeButtons({ onLike, onNope, isDisabled }: Props) {
  return (
    <div className="flex items-center justify-center gap-8 py-2">
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={onNope}
        disabled={isDisabled}
        className="w-16 h-16 rounded-full bg-white shadow-card-lg flex items-center justify-center text-2xl disabled:opacity-40 active:shadow-md transition-shadow"
        aria-label="Nope"
      >
        ✕
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={onLike}
        disabled={isDisabled}
        className="w-20 h-20 rounded-full bg-gold shadow-card-lg flex items-center justify-center text-3xl disabled:opacity-40 active:shadow-md transition-shadow"
        aria-label="Like"
      >
        ♥
      </motion.button>

    </div>
  )
}
