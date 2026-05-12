import { createAdminClient } from '@/lib/supabase/admin'
import ProfileTable from '@/components/admin/ProfileTable'
import type { User } from '@/types'

export const revalidate = 0

export default async function AdminPage() {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  const profiles = (data ?? []) as User[]

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl text-slate-800">Guests</h2>
          <p className="text-slate-400 text-sm font-body mt-0.5">
            {profiles.length} registered · {profiles.filter(p => p.is_active).length} active
          </p>
        </div>
      </div>

      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <ProfileTable initialProfiles={profiles} />
      </div>
    </div>
  )
}
