import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createAdminClient()
  const { error, count } = await supabase
    .from('users')
    .delete({ count: 'exact' })
    .eq('id', params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (count === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
