import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useRealtimeMatches } from './useRealtimeMatches'

// Capture registered handlers so tests can fire them manually
type ChangeHandler = (payload: { new: Record<string, string> }) => void
let handlers: Record<string, ChangeHandler> = {}
let subscribeCount = 0
const mockRemoveChannel = vi.fn().mockResolvedValue({})

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    channel: vi.fn(() => {
      const channelObj = {
        on: vi.fn((_, filterOrEvent: unknown, handlerOrConfig: unknown, maybeHandler?: ChangeHandler) => {
          // Supabase API: .on('postgres_changes', { filter }, handler)
          const filter = (filterOrEvent as { filter?: string })?.filter ?? ''
          const handler = (maybeHandler ?? handlerOrFilter) as ChangeHandler
          function handlerOrFilter(x: unknown) { return x }
          handlers[filter] = maybeHandler ?? (handlerOrConfig as ChangeHandler)
          return channelObj
        }),
        subscribe: vi.fn(() => { subscribeCount++; return channelObj }),
      }
      return channelObj
    }),
    removeChannel: mockRemoveChannel,
  }),
}))

describe('useRealtimeMatches', () => {
  beforeEach(() => {
    handlers = {}
    subscribeCount = 0
    mockRemoveChannel.mockClear()
  })

  it('calls onMatch with the OTHER user\'s id when current user is user1', () => {
    const onMatch = vi.fn()
    renderHook(() => useRealtimeMatches('user-A', onMatch))

    // Find the user1_id handler and fire it
    const user1Handler = Object.entries(handlers).find(([k]) => k.includes('user1_id'))?.[1]
    expect(user1Handler).toBeDefined()
    user1Handler!({ new: { user1_id: 'user-A', user2_id: 'user-B' } })

    expect(onMatch).toHaveBeenCalledWith('user-B')
    expect(onMatch).not.toHaveBeenCalledWith('user-A')
  })

  it('calls onMatch with the OTHER user\'s id when current user is user2', () => {
    const onMatch = vi.fn()
    renderHook(() => useRealtimeMatches('user-B', onMatch))

    const user2Handler = Object.entries(handlers).find(([k]) => k.includes('user2_id'))?.[1]
    expect(user2Handler).toBeDefined()
    user2Handler!({ new: { user1_id: 'user-A', user2_id: 'user-B' } })

    expect(onMatch).toHaveBeenCalledWith('user-A')
    expect(onMatch).not.toHaveBeenCalledWith('user-B')
  })

  it('unsubscribes (removeChannel) when the component unmounts', () => {
    const { unmount } = renderHook(() => useRealtimeMatches('user-A', vi.fn()))
    unmount()
    expect(mockRemoveChannel).toHaveBeenCalledTimes(1)
  })

  it('does not subscribe when currentUserId is undefined', () => {
    renderHook(() => useRealtimeMatches(undefined, vi.fn()))
    expect(subscribeCount).toBe(0)
  })
})
