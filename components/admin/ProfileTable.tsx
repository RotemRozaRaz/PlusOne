'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Avatar from '@/components/ui/Avatar'
import type { User } from '@/types'

interface Props {
  initialProfiles: User[]
}

export default function ProfileTable({ initialProfiles }: Props) {
  const router = useRouter()
  const [profiles, setProfiles] = useState<User[]>(initialProfiles)
  const [loading, setLoading] = useState<string | null>(null)

  async function toggleActive(user: User) {
    setLoading(user.id)
    const res = await fetch(`/api/admin/profiles/${user.id}/toggle`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !user.is_active }),
    })
    if (res.ok) {
      setProfiles(prev =>
        prev.map(p => p.id === user.id ? { ...p, is_active: !p.is_active } : p)
      )
    }
    setLoading(null)
  }

  async function deleteUser(userId: string) {
    if (!confirm('Delete this profile? This cannot be undone.')) return
    setLoading(userId)
    const res = await fetch(`/api/admin/profiles/${userId}/delete`, {
      method: 'DELETE',
    })
    if (res.ok) {
      setProfiles(prev => prev.filter(p => p.id !== userId))
    }
    setLoading(null)
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm font-body">
        <thead>
          <tr className="border-b border-blush text-left text-slate-400">
            <th className="px-4 py-3 font-normal">Guest</th>
            <th className="px-4 py-3 font-normal hidden sm:table-cell">Instagram</th>
            <th className="px-4 py-3 font-normal hidden md:table-cell">Joined</th>
            <th className="px-4 py-3 font-normal">Status</th>
            <th className="px-4 py-3 font-normal">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-blush/40">
          {profiles.map(user => (
            <tr key={user.id} className={`${!user.is_active ? 'opacity-50' : ''}`}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar src={user.photo_url} name={user.name} size={36} />
                  <span className="font-semibold text-slate-800">{user.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">
                {user.instagram ? `@${user.instagram}` : '—'}
              </td>
              <td className="px-4 py-3 text-slate-400 hidden md:table-cell">
                {new Date(user.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    user.is_active
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {user.is_active ? 'Active' : 'Hidden'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(user)}
                    disabled={loading === user.id}
                    className="text-xs px-3 py-1 rounded-full border border-blush text-slate-600 hover:bg-blush/30 transition-colors disabled:opacity-50"
                  >
                    {user.is_active ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
                    disabled={loading === user.id}
                    className="text-xs px-3 py-1 rounded-full border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {profiles.length === 0 && (
        <div className="text-center py-12 text-slate-400">No guests yet.</div>
      )}
    </div>
  )
}
