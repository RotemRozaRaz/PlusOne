import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// We test the middleware logic by calling it directly with a mocked NextRequest.
// crypto.subtle is available in Node 18+ (the environment Next.js runs in).

async function sha256Hex(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input)
  const buf = await crypto.subtle.digest('SHA-256', encoded)
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

// Minimal NextRequest/NextResponse stubs
class FakeURL {
  pathname: string
  href: string
  constructor(path: string, base?: string) {
    this.pathname = path
    this.href = base ? `${base}${path}` : `http://localhost${path}`
  }
}

class FakeCookies {
  private map: Map<string, string>
  constructor(init: Record<string, string> = {}) {
    this.map = new Map(Object.entries(init))
  }
  get(name: string) { return this.map.has(name) ? { value: this.map.get(name)! } : undefined }
}

class FakeHeaders extends Map<string, string> {
  set(k: string, v: string) { super.set(k, v); return this }
}

function makeRequest(pathname: string, cookies: Record<string, string> = {}) {
  return {
    nextUrl: new FakeURL(pathname),
    url: `http://localhost${pathname}`,
    headers: new FakeHeaders(),
    cookies: new FakeCookies(cookies),
  }
}

// Import after mocking next/server
vi.mock('next/server', () => {
  return {
    NextResponse: {
      next: vi.fn((opts?: { request?: { headers?: unknown } }) => ({
        type: 'next',
        headers: opts?.request?.headers,
      })),
      redirect: vi.fn((url: FakeURL) => ({ type: 'redirect', url: url.href ?? url })),
    },
  }
})

describe('middleware', () => {
  const originalEnv = process.env.ADMIN_PASSWORD

  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    process.env.ADMIN_PASSWORD = originalEnv
  })

  it('redirects to /admin/login when admin_session cookie is absent', async () => {
    process.env.ADMIN_PASSWORD = 'secret'
    const { middleware } = await import('./middleware')
    const req = makeRequest('/admin')
    const res = await middleware(req as never)
    expect((res as { type: string }).type).toBe('redirect')
    expect((res as { url: string }).url).toContain('/admin/login')
  })

  it('redirects when admin_session cookie value is incorrect', async () => {
    process.env.ADMIN_PASSWORD = 'secret'
    const { middleware } = await import('./middleware')
    const req = makeRequest('/admin', { admin_session: 'wrong-hash' })
    const res = await middleware(req as never)
    expect((res as { type: string }).type).toBe('redirect')
    expect((res as { url: string }).url).toContain('/admin/login')
  })

  it('allows access to /admin when admin_session cookie matches SHA-256 of ADMIN_PASSWORD', async () => {
    process.env.ADMIN_PASSWORD = 'secret'
    const correctToken = await sha256Hex('secret')
    const { middleware } = await import('./middleware')
    const req = makeRequest('/admin', { admin_session: correctToken })
    const res = await middleware(req as never)
    expect((res as { type: string }).type).toBe('next')
  })

  it('bypasses auth check for /admin/login route', async () => {
    process.env.ADMIN_PASSWORD = 'secret'
    const { middleware } = await import('./middleware')
    const req = makeRequest('/admin/login')
    const res = await middleware(req as never)
    expect((res as { type: string }).type).toBe('next')
  })

  it('bypasses auth check for /api/admin/login route', async () => {
    process.env.ADMIN_PASSWORD = 'secret'
    const { middleware } = await import('./middleware')
    const req = makeRequest('/api/admin/login')
    const res = await middleware(req as never)
    expect((res as { type: string }).type).toBe('next')
  })

  it('forwards x-pathname header to server components via NextResponse.next options', async () => {
    process.env.ADMIN_PASSWORD = 'secret'
    const correctToken = await sha256Hex('secret')
    const { NextResponse } = await import('next/server')
    const { middleware } = await import('./middleware')
    const req = makeRequest('/admin/dashboard', { admin_session: correctToken })
    await middleware(req as never)
    // NextResponse.next is called with { request: { headers } } — verify x-pathname is set
    const callArg = vi.mocked(NextResponse.next).mock.calls.at(-1)?.[0] as { request?: { headers?: Map<string, string> } } | undefined
    const headers = callArg?.request?.headers as Map<string, string> | undefined
    expect(headers?.get?.('x-pathname')).toBe('/admin/dashboard')
  })
})
