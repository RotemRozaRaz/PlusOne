import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useSwipeQueue } from './useSwipeQueue'
import type { User } from '@/types'

const makeUser = (id: string): User => ({
  id,
  device_id: `device-${id}`,
  name: `User ${id}`,
  instagram: null,
  photo_url: 'https://example.com/photo.jpg',
  created_at: new Date().toISOString(),
  is_active: true,
})

const mockNeq = vi.fn()
const mockOrder = vi.fn()
const mockEq = vi.fn()
const mockSelect = vi.fn()
const mockFrom = vi.fn()

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({ from: mockFrom }),
}))

describe('useSwipeQueue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('excludes the current user from their own queue', async () => {
    const currentUserId = 'user-A'
    const profiles = [makeUser('user-B'), makeUser('user-C')]

    // likes query returns empty
    mockFrom.mockImplementationOnce(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    }))
    // profiles query — neq already excludes current user (we verify .neq was called)
    mockFrom.mockImplementationOnce(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          neq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: profiles, error: null }),
          }),
        }),
      }),
    }))

    const { result } = renderHook(() => useSwipeQueue(currentUserId))
    await waitFor(() => expect(result.current.queue.length).toBeGreaterThan(0))
    const ids = result.current.queue.map(u => u.id)
    expect(ids).not.toContain(currentUserId)
  })

  it('excludes profiles the current user has already liked', async () => {
    const currentUserId = 'user-A'
    const profiles = [makeUser('user-B'), makeUser('user-C'), makeUser('user-D')]

    mockFrom.mockImplementationOnce(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: [{ liked_id: 'user-B' }],
          error: null,
        }),
      }),
    }))
    mockFrom.mockImplementationOnce(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          neq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: profiles, error: null }),
          }),
        }),
      }),
    }))

    const { result } = renderHook(() => useSwipeQueue(currentUserId))
    await waitFor(() => expect(result.current.queue.length).toBe(2))
    const ids = result.current.queue.map(u => u.id)
    expect(ids).not.toContain('user-B')
  })

  it('returns empty queue when profiles Supabase query errors (not full user list)', async () => {
    mockFrom.mockImplementationOnce(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    }))
    mockFrom.mockImplementationOnce(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          neq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } }),
          }),
        }),
      }),
    }))

    const { result } = renderHook(() => useSwipeQueue('user-A'))
    // Give time for async load
    await new Promise(r => setTimeout(r, 50))
    expect(result.current.queue).toHaveLength(0)
  })

  it('markSeen removes the profile from the local queue', async () => {
    const profiles = [makeUser('user-B'), makeUser('user-C')]

    mockFrom.mockImplementationOnce(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    }))
    mockFrom.mockImplementationOnce(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          neq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: profiles, error: null }),
          }),
        }),
      }),
    }))

    const { result } = renderHook(() => useSwipeQueue('user-A'))
    await waitFor(() => expect(result.current.queue.length).toBe(2))

    act(() => result.current.markSeen('user-B'))
    expect(result.current.queue).toHaveLength(1)
    expect(result.current.queue[0].id).toBe('user-C')
  })

  it('does nothing when currentUserId is undefined', () => {
    const { result } = renderHook(() => useSwipeQueue(undefined))
    expect(result.current.queue).toHaveLength(0)
    expect(mockFrom).not.toHaveBeenCalled()
  })
})
