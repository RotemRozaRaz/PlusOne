import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { is_active } = await request.json()
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('users')
    .update({ is_active })
    .eq('id', params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
