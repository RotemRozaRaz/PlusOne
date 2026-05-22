'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import BottomNav from '@/components/BottomNav'
import Avatar from '@/components/ui/Avatar'
import Spinner from '@/components/ui/Spinner'
import LogoutButton from '@/components/ui/LogoutButton'
import EditProfileForm from '@/components/profile/EditProfileForm'
import { useProfile } from '@/lib/hooks/useProfile'
import { useLikes } from '@/lib/hooks/useLikes'
import type { User } from '@/types'

export default function ProfilePage() {
  const router = useRouter()
  const { profile: initialProfile, loading: profileLoading } = useProfile()
  const [profile, setProfile] = useState<User | null>(null)

  useEffect(() => {
    if (initialProfile) setProfile(initialProfile)
  }, [initialProfile])

  useEffect(() => {
    if (!profileLoading && !initialProfile) router.replace('/onboard')
  }, [initialProfile, profileLoading, router])

  const { likes, loading: likesLoading, error: likesError } = useLikes(profile?.id)

  const loading = profileLoading || (!!profile && likesLoading)

  if (profileLoading || !profile) {
    return (
      <div className="min-h-dvh bg-ivory flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-ivory flex flex-col pb-20">
      <header className="px-5 pt-safe pb-3 border-b border-blush/40">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl text-slate-800">My Profile</h1>
          <LogoutButton />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-8">
        {/* Avatar + name */}
        <div className="flex items-center gap-4">
          <Avatar src={profile.photo_url} name={profile.name} size={80} />
          <div>
            <p className="font-display text-2xl text-slate-800">{profile.name}</p>
            {profile.instagram && (
              <p className="text-slate-400 text-sm">@{profile.instagram}</p>
            )}
            {!profile.instagram && profile.phone && (
              <p className="text-slate-400 text-sm">{profile.phone}</p>
            )}
          </div>
        </div>

        {/* Edit form */}
        <EditProfileForm profile={profile} onSaved={setProfile} />

        {/* Divider */}
        <div className="border-t border-blush/40" />

        {/* Likes list */}
        <div>
          <h2 className="font-display text-xl text-slate-700 mb-3">People you liked</h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : likesError ? (
            <p className="text-red-400 text-sm">{likesError}</p>
          ) : likes.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-4xl block mb-2">🔥</span>
              <p className="text-slate-400 text-sm">No likes yet — go swipe!</p>
            </div>
          ) : (
            <ul className="divide-y divide-blush/40">
              {likes.map(liked => (
                <li key={liked.id} className="flex items-center gap-4 py-3">
                  <Avatar src={liked.photo_url} name={liked.name} size={48} />
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-semibold text-slate-800 truncate">{liked.name}</p>
                    {liked.instagram ? (
                      <a
                        href={`https://instagram.com/${liked.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold text-sm"
                      >
                        @{liked.instagram} ↗
                      </a>
                    ) : liked.phone ? (
                      <span className="text-slate-500 text-sm">{liked.phone}</span>
                    ) : null}
                  </div>
                  {liked.isMatch && (
                    <span className="text-sm font-body text-gold font-semibold whitespace-nowrap">
                      Matched! 💍
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <BottomNav active="profile" />
    </div>
  )
}
