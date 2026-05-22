'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useProfile } from '@/lib/hooks/useProfile'
import type { User } from '@/types'

interface Props {
  profile: User
  onClose: () => void
}

type LikeState = 'idle' | 'loading' | 'liked' | 'matched'

export default function ProfileModal({ profile, onClose }: Props) {
  const { profile: currentUser } = useProfile()
  const [likeState, setLikeState] = useState<LikeState>('idle')

  async function handleLike() {
    if (!currentUser || likeState !== 'idle') return
    if (currentUser.id === profile.id) return
    setLikeState('loading')

    const supabase = createClient()
    await supabase.rpc('try_create_match', {
      p_liker: currentUser.id,
      p_liked: profile.id,
    })

    const u1 = [currentUser.id, profile.id].sort()[0]
    const u2 = [currentUser.id, profile.id].sort()[1]
    const { data: match } = await supabase
      .from('matches')
      .select('id')
      .eq('user1_id', u1)
      .eq('user2_id', u2)
      .maybeSingle()

    setLikeState(match ? 'matched' : 'liked')
  }

  const likeLabel: Record<LikeState, string> = {
    idle: '♥ Like',
    loading: '…',
    liked: 'Liked ✓',
    matched: "It's a Match! 💍",
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative w-full max-w-sm mx-auto bg-ivory rounded-t-[28px] sm:rounded-[28px] overflow-hidden shadow-card-lg"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative" style={{ aspectRatio: '3/4' }}>
          <Image
            src={profile.photo_url}
            alt={profile.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center text-lg"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <h2 className="font-display text-4xl text-slate-800">{profile.name}</h2>

          {profile.instagram ? (
            <a
              href={`https://instagram.com/${profile.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold text-sm font-body mt-1 block"
            >
              @{profile.instagram} ↗
            </a>
          ) : profile.phone ? (
            <span className="text-slate-500 text-sm font-body mt-1 block">{profile.phone}</span>
          ) : null}

          <div className="mt-5 flex gap-3">
            <button
              onClick={handleLike}
              disabled={!currentUser || likeState !== 'idle'}
              className={`flex-1 py-3.5 rounded-full font-body font-semibold transition-all ${
                likeState === 'matched'
                  ? 'bg-gold text-white'
                  : likeState === 'liked'
                  ? 'bg-blush text-slate-700'
                  : 'bg-gold text-white'
              } disabled:opacity-60`}
            >
              {likeLabel[likeState]}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
