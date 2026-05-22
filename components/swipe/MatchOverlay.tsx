'use client'

import Image from 'next/image'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import type { User } from '@/types'

interface Props {
  currentUser: User
  matchedUser: User
  onDismiss: () => void
}

export default function MatchOverlay({ currentUser, matchedUser, onDismiss }: Props) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 10_000)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6 text-center"
      style={{
        background: 'linear-gradient(160deg, #F5E1DA 0%, #FAF0E6 45%, #FFF9F0 100%)',
      }}
      onClick={onDismiss}
    >
      <motion.div
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mb-8"
        onClick={e => e.stopPropagation()}
      >
        <p className="font-body text-gold uppercase tracking-[0.25em] text-sm mb-1">
          It&apos;s a
        </p>
        <h1 className="font-display text-7xl font-semibold text-slate-800 leading-none">
          Match!
        </h1>
      </motion.div>

      <div className="flex items-center gap-5 mb-8" onClick={e => e.stopPropagation()}>
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.25, type: 'spring', stiffness: 220 }}
          className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-card-lg"
        >
          <Image
            src={currentUser.photo_url}
            alt={currentUser.name}
            fill
            className="object-cover"
          />
        </motion.div>

        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.45, type: 'spring', stiffness: 400 }}
          className="text-4xl"
        >
          💍
        </motion.span>

        <motion.div
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.25, type: 'spring', stiffness: 220 }}
          className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-card-lg"
        >
          <Image
            src={matchedUser.photo_url}
            alt={matchedUser.name}
            fill
            className="object-cover"
          />
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="font-display text-2xl text-slate-700 mb-10"
        onClick={e => e.stopPropagation()}
      >
        {currentUser.name} &amp; {matchedUser.name}
      </motion.p>

      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.65 }}
        className="flex flex-col gap-3 w-full max-w-xs"
        onClick={e => e.stopPropagation()}
      >
        {matchedUser.instagram ? (
          <a
            href={`https://instagram.com/${matchedUser.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gold text-white text-center py-3.5 px-6 rounded-full font-body font-semibold shadow-card"
          >
            Open Instagram ↗
          </a>
        ) : matchedUser.phone ? (
          <div className="bg-gold/10 border border-gold/30 text-slate-700 text-center py-3.5 px-6 rounded-full font-body">
            📞 {matchedUser.phone}
          </div>
        ) : null}
        <button
          onClick={onDismiss}
          className="bg-white/70 border border-blush text-slate-700 py-3.5 px-6 rounded-full font-body"
        >
          Keep Swiping
        </button>
      </motion.div>
    </motion.div>
  )
}
