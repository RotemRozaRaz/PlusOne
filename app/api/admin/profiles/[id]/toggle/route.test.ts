import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockUpdate = vi.fn()
const mockEq = vi.fn()
const mockFrom = vi.fn()

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: () => ({
    from: mockFrom,
  }),
}))

beforeEach(() => {
  vi.resetModules()
  mockFrom.mockReset()
  mockUpdate.mockReset()
  mockEq.mockReset()
})

function makeRequest(body: unknown): Request {
  return new Request('http://localhost', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function makeParams(id: string) {
  return { params: { id } }
}

describe('PATCH /api/admin/profiles/[id]/toggle', () => {
  it('sets is_active to true when body contains { is_active: true }', async () => {
    mockFrom.mockReturnValue({ update: mockUpdate.mockReturnValue({ eq: mockEq.mockResolvedValue({ error: null }) }) })
    const { PATCH } = await import('./route')
    const res = await PATCH(makeRequest({ is_active: true }), makeParams('user-id') as never)
    expect(res.status).toBe(200)
    expect(mockUpdate).toHaveBeenCalledWith({ is_active: true })
  })

  it('sets is_active to false when body contains { is_active: false }', async () => {
    mockFrom.mockReturnValue({ update: mockUpdate.mockReturnValue({ eq: mockEq.mockResolvedValue({ error: null }) }) })
    const { PATCH } = await import('./route')
    const res = await PATCH(makeRequest({ is_active: false }), makeParams('user-id') as never)
    expect(res.status).toBe(200)
    expect(mockUpdate).toHaveBeenCalledWith({ is_active: false })
  })

  it('returns 400 for non-boolean is_active values', async () => {
    mockFrom.mockReturnValue({ update: mockUpdate.mockReturnValue({ eq: mockEq.mockResolvedValue({ error: null }) }) })
    const { PATCH } = await import('./route')
    const res = await PATCH(makeRequest({ is_active: 'yes' }), makeParams('user-id') as never)
    expect(res.status).toBe(400)
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it('returns 500 when Supabase returns an error', async () => {
    mockFrom.mockReturnValue({ update: mockUpdate.mockReturnValue({ eq: mockEq.mockResolvedValue({ error: { message: 'update failed' } }) }) })
    const { PATCH } = await import('./route')
    const res = await PATCH(makeRequest({ is_active: true }), makeParams('user-id') as never)
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.error).toBe('update failed')
  })
})
