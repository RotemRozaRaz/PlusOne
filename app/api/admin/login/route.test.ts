import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Dynamic import so we can control process.env per test
async function getHandler() {
  const mod = await import('./route')
  return mod.POST
}

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/admin/login', () => {
  const originalEnv = process.env.ADMIN_PASSWORD

  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    process.env.ADMIN_PASSWORD = originalEnv
  })

  it('returns 400 when password field is missing', async () => {
    process.env.ADMIN_PASSWORD = 'secret'
    const POST = (await import('./route')).POST
    const res = await POST(makeRequest({}))
    expect(res.status).toBe(400)
  })

  it('returns 400 when body is not valid JSON', async () => {
    process.env.ADMIN_PASSWORD = 'secret'
    const POST = (await import('./route')).POST
    const badReq = new Request('http://localhost/api/admin/login', {
      method: 'POST',
      body: 'not-json',
    })
    const res = await POST(badReq)
    expect(res.status).toBe(400)
  })

  it('returns 401 for wrong password', async () => {
    process.env.ADMIN_PASSWORD = 'secret'
    const POST = (await import('./route')).POST
    const res = await POST(makeRequest({ password: 'wrong' }))
    expect(res.status).toBe(401)
  })

  it('returns 200 and sets httpOnly admin_session cookie for correct password', async () => {
    process.env.ADMIN_PASSWORD = 'correct'
    const POST = (await import('./route')).POST
    const res = await POST(makeRequest({ password: 'correct' }))
    expect(res.status).toBe(200)
    const setCookie = res.headers.get('set-cookie') ?? ''
    expect(setCookie).toContain('admin_session=')
    expect(setCookie).toContain('HttpOnly')
  })

  it('returns 401 for empty string password (not 400 — empty string is a wrong password, not a missing field)', async () => {
    process.env.ADMIN_PASSWORD = 'secret'
    const POST = (await import('./route')).POST
    const res = await POST(makeRequest({ password: '' }))
    expect(res.status).toBe(401)
  })

  it('returns 401 when both ADMIN_PASSWORD and submission are empty strings — empty env var must not grant access', async () => {
    process.env.ADMIN_PASSWORD = ''
    vi.resetModules()
    const POST = (await import('./route')).POST
    const res = await POST(makeRequest({ password: '' }))
    expect(res.status).toBe(401)
  })
})
