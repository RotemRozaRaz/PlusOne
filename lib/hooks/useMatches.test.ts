import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useMatches } from './useMatches'
import type { User } from '@/types'

const mockRpc = vi.fn()

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({ rpc: mockRpc }),
}))

const makeUser = (id: string): User => ({
  id,
  device_id: `device-${id}`,
  name: `User ${id}`,
  instagram: null,
  photo_url: 'https://example.com/photo.jpg',
  created_at: new Date().toISOString(),
  is_active: true,
})

describe('useMatches', () => {
  beforeEach(() => {
    mockRpc.mockReset()
  })

  it('starts in loading state', () => {
    mockRpc.mockReturnValue(new Promise(() => {})) // never resolves
    const { result } = renderHook(() => useMatches('user-A'))
    expect(result.current.loading).toBe(true)
    expect(result.current.matches).toHaveLength(0)
  })

  it('returns correct match list when RPC succeeds', async () => {
    const matches = [makeUser('user-B'), makeUser('user-C')]
    mockRpc.mockResolvedValue({ data: matches, error: null })

    const { result } = renderHook(() => useMatches('user-A'))
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.matches).toEqual(matches)
    expect(result.current.error).toBeNull()
  })

  it('returns empty array and sets error string when RPC fails', async () => {
    mockRpc.mockResolvedValue({ data: null, error: { message: 'function not found' } })

    const { result } = renderHook(() => useMatches('user-A'))
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.matches).toHaveLength(0)
    expect(result.current.error).toBe('function not found')
  })

  it('calls get_my_matches with the correct user id argument', async () => {
    mockRpc.mockResolvedValue({ data: [], error: null })
    renderHook(() => useMatches('user-A'))
    await waitFor(() => expect(mockRpc).toHaveBeenCalled())
    expect(mockRpc).toHaveBeenCalledWith('get_my_matches', { p_user_id: 'user-A' })
  })

  it('does not call RPC and sets loading=false when currentUserId is undefined', async () => {
    const { result } = renderHook(() => useMatches(undefined))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(mockRpc).not.toHaveBeenCalled()
  })
})
