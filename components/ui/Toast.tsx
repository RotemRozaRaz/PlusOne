'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'

interface Props {
  message: string
  duration?: number
  onDismiss: () => void
}

export default function Toast({ message, duration = 2500, onDismiss }: Props) {
  useEffect(() => {
    const t = setTimeout(onDismiss, duration)
    return () => clearTimeout(t)
  }, [duration, onDismiss])

  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -60, opacity: 0 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white rounded-full px-5 py-2.5 shadow-card-lg border border-blush text-slate-700 text-sm font-body font-medium whitespace-nowrap pointer-events-none"
    >
      {message}
    </motion.div>
  )
}
