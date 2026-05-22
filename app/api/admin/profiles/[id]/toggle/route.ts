import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json().catch(() => null)
  if (typeof body?.is_active !== 'boolean') {
    return NextResponse.json({ error: 'is_active must be a boolean' }, { status: 400 })
  }
  const { is_active } = body
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
