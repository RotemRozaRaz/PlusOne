import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockDelete = vi.fn()
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
  mockEq.mockReset()
  mockDelete.mockReset()
})

function makeParams(id: string) {
  return { params: { id } }
}

describe('DELETE /api/admin/profiles/[id]/delete', () => {
  it('returns 200 for a valid user id', async () => {
    mockFrom.mockReturnValue({ delete: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null, count: 1 }) }) })
    const { DELETE } = await import('./route')
    const res = await DELETE(new Request('http://localhost'), makeParams('valid-id') as never)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })

  it('returns 404 for a non-existent id', async () => {
    mockFrom.mockReturnValue({ delete: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null, count: 0 }) }) })
    const { DELETE } = await import('./route')
    const res = await DELETE(new Request('http://localhost'), makeParams('non-existent-uuid') as never)
    expect(res.status).toBe(404)
  })

  it('returns 500 when Supabase returns an error', async () => {
    mockFrom.mockReturnValue({ delete: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: { message: 'DB error' } }) }) })
    const { DELETE } = await import('./route')
    const res = await DELETE(new Request('http://localhost'), makeParams('some-id') as never)
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.error).toBe('DB error')
  })
})
