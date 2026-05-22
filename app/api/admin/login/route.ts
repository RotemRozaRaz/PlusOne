import { NextResponse } from 'next/server'
import { createHash, timingSafeEqual } from 'crypto'

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const submitted = body?.password

  if (submitted == null || typeof submitted !== 'string') {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const adminPassword = process.env.ADMIN_PASSWORD ?? ''

  if (!adminPassword) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }
  const submittedBuf = Buffer.from(submitted)
  const expectedBuf = Buffer.from(adminPassword)

  const lengthMatch = submittedBuf.length === expectedBuf.length
  const valueMatch =
    lengthMatch &&
    timingSafeEqual(submittedBuf, expectedBuf)

  if (!valueMatch) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const token = hashPassword(adminPassword)
  const response = NextResponse.json({ success: true })
  response.cookies.set('admin_session', token, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24,
    path: '/',
  })

  return response
}
