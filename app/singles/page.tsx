import { createClient } from '@/lib/supabase/server'
import SinglesGrid from '@/components/singles/SinglesGrid'
import BottomNav from '@/components/BottomNav'
import LogoutButton from '@/components/ui/LogoutButton'
import type { User } from '@/types'

export const revalidate = 60

export default async function SinglesPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  const profiles = (data ?? []) as User[]

  return (
    <div className="min-h-dvh bg-ivory">
      <header className="sticky top-0 z-30 bg-ivory/90 backdrop-blur-md px-5 pt-safe pb-3 border-b border-blush/40">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl text-slate-800">All Singles</h1>
          <LogoutButton />
        </div>
        <p className="text-slate-400 text-xs font-body mt-0.5">
          {profiles.length} {profiles.length === 1 ? 'guest' : 'guests'} at the party
        </p>
      </header>

      <SinglesGrid profiles={profiles} />

      <BottomNav active="singles" />
    </div>
  )
}
