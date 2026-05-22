import { vi } from 'vitest'

// Chainable Supabase query builder mock
function makeQueryBuilder(resolveValue: { data?: unknown; error?: unknown } = { data: null }) {
  const builder: Record<string, unknown> = {}
  const methods = ['select', 'insert', 'update', 'delete', 'eq', 'neq', 'in', 'order', 'single', 'limit']
  methods.forEach(m => {
    builder[m] = vi.fn(() => builder)
  })
  // terminal: returns a promise
  ;(builder as { then: unknown }).then = (resolve: (v: unknown) => unknown) =>
    Promise.resolve(resolveValue).then(resolve)
  return builder
}

export function createMockSupabaseClient(overrides: Record<string, unknown> = {}) {
  const queryBuilder = makeQueryBuilder()

  return {
    from: vi.fn(() => queryBuilder),
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn().mockResolvedValue({ error: null }),
        getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/photo.jpg' } }),
      })),
    },
    rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis(),
    })),
    removeChannel: vi.fn().mockResolvedValue({}),
    ...overrides,
  }
}
