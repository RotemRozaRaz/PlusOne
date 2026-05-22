'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import NameStep from './NameStep'
import InstagramStep from './InstagramStep'
import PhotoStep from './PhotoStep'
import LoginStep from './LoginStep'
import ProgressDots from '@/components/ui/ProgressDots'
import { getOrCreateDeviceId } from '@/lib/deviceId'
import { compressPhoto } from '@/lib/imageCompression'
import { createClient } from '@/lib/supabase/client'

type Step = 'name' | 'instagram' | 'photo'
type Mode = 'create' | 'login'

const stepIndex: Record<Step, number> = { name: 0, instagram: 1, photo: 2 }

export default function OnboardingForm() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('create')
  const [step, setStep] = useState<Step>('name')
  const [name, setName] = useState('')
  const [instagram, setInstagram] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    if (!photoFile || isSubmitting) return
    setIsSubmitting(true)
    setError(null)

    try {
      const deviceId = getOrCreateDeviceId()
      const supabase = createClient()
      const userId = crypto.randomUUID()

      const compressed = await compressPhoto(photoFile)
      const fileName = `${userId}.jpg`

      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, compressed, { contentType: 'image/jpeg', upsert: true })

      if (uploadError) throw new Error(uploadError.message)

      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName)

      const { error: insertError } = await supabase.from('users').insert({
        id: userId,
        device_id: deviceId,
        name: name.trim(),
        instagram: instagram.trim() || null,
        photo_url: publicUrl,
      })

      if (insertError) throw new Error(insertError.message)

      localStorage.setItem('plus_one_user_id', userId)
      router.replace('/swipe')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-dvh bg-ivory flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <div className="mb-10 text-center">
          <h1 className="font-display text-5xl text-slate-800">Plus One</h1>
          <p className="text-slate-500 mt-1 text-sm">Rotem&apos;s &amp; Itay&apos;s Singles</p>
        </div>

        <div className="w-full max-w-sm">
          {mode === 'login' ? (
            <LoginStep onBack={() => setMode('create')} />
          ) : (
            <>
              <AnimatePresence mode="wait">
                {step === 'name' && (
                  <motion.div
                    key="name"
                    initial={{ x: 60, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -60, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    <NameStep
                      defaultValue={name}
                      onContinue={n => { setName(n); setStep('instagram') }}
                    />
                  </motion.div>
                )}
                {step === 'instagram' && (
                  <motion.div
                    key="instagram"
                    initial={{ x: 60, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -60, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    <InstagramStep
                      defaultValue={instagram}
                      onContinue={h => { setInstagram(h); setStep('photo') }}
                      onSkip={() => { setInstagram(''); setStep('photo') }}
                    />
                  </motion.div>
                )}
                {step === 'photo' && (
                  <motion.div
                    key="photo"
                    initial={{ x: 60, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -60, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    <PhotoStep
                      onPhotoSelected={setPhotoFile}
                      onSubmit={handleSubmit}
                      isSubmitting={isSubmitting}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
              )}

              <ProgressDots total={3} current={stepIndex[step]} />

              <button
                onClick={() => setMode('login')}
                className="mt-6 block w-full text-center text-sm text-slate-400 hover:text-slate-600 transition-colors"
              >
                Already joined? Sign in with Instagram →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
