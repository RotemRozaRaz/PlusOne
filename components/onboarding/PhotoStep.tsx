'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'

interface Props {
  onPhotoSelected: (file: File) => void
  onSubmit: () => void
  isSubmitting: boolean
}

export default function PhotoStep({ onPhotoSelected, onSubmit, isSubmitting }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    onPhotoSelected(file)
    const url = URL.createObjectURL(file)
    setPreview(url)
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-display text-3xl text-slate-800 mb-1">Add your photo</h2>
        <p className="text-slate-400 text-sm">A selfie works great! This is your profile picture.</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-square rounded-card overflow-hidden shadow-card"
          >
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => { setPreview(null); if (inputRef.current) inputRef.current.value = '' }}
              className="absolute top-3 right-3 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm"
            >
              ✕
            </button>
          </motion.div>
        ) : (
          <motion.button
            key="trigger"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-card border-2 border-dashed border-blush flex flex-col items-center justify-center gap-3 text-slate-400 bg-white/50 active:bg-blush/20 transition-colors"
          >
            <span className="text-4xl">📷</span>
            <span className="text-sm font-body">Tap to take or upload a photo</span>
          </motion.button>
        )}
      </AnimatePresence>

      {preview && (
        <Button onClick={onSubmit} disabled={isSubmitting} className="w-full">
          {isSubmitting ? <Spinner className="w-5 h-5 mx-auto" /> : "Let's go! 🎉"}
        </Button>
      )}
    </div>
  )
}
