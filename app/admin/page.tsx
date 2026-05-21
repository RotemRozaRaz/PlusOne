import { createAdminClient } from '@/lib/supabase/admin'
import ProfileTable from '@/components/admin/ProfileTable'
import type { User } from '@/types'

export const revalidate = 0

export default async function AdminPage() {
  let profiles: User[] = []
  let fetchError: string | null = null

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) fetchError = error.message
    else profiles = (data ?? []) as User[]
  } catch (e) {
    fetchError = e instanceof Error ? e.message : String(e)
  }

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

      {fetchError && (
        <p className="text-red-400 text-sm mb-4 font-body">Error: {fetchError}</p>
      )}

      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <ProfileTable initialProfiles={profiles} />
      </div>
    </div>
  )
}
