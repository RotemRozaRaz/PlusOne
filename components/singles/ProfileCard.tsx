'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { User } from '@/types'

interface Props {
  profile: User
  onClick: () => void
  index: number
}

export default function ProfileCard({ profile, onClick, index }: Props) {
  const tall = index % 3 === 1

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      onClick={onClick}
      className="w-full text-left rounded-[20px] overflow-hidden shadow-card relative group"
      style={{ aspectRatio: tall ? '3/4' : '4/5' }}
    >
      <Image
        src={profile.photo_url}
        alt={profile.name}
        fill
        className="object-cover"
        draggable={false}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-white font-body font-semibold text-sm leading-tight truncate">
          {profile.name}
        </p>
        {profile.instagram && (
          <p className="text-white/60 text-xs mt-0.5 truncate">@{profile.instagram}</p>
        )}
      </div>
    </motion.button>
  )
}
