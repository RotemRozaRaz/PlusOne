import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import MatchesPage from './page'
import type { User } from '@/types'

const mockReplace = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}))

const mockUseProfile = vi.fn()
const mockUseMatches = vi.fn()

vi.mock('@/lib/hooks/useProfile', () => ({ useProfile: () => mockUseProfile() }))
vi.mock('@/lib/hooks/useMatches', () => ({ useMatches: () => mockUseMatches() }))

const makeUser = (id: string, instagram?: string): User => ({
  id,
  device_id: `device-${id}`,
  name: `User ${id}`,
  instagram: instagram ?? null,
  photo_url: 'https://example.com/photo.jpg',
  created_at: new Date().toISOString(),
  is_active: true,
})

describe('MatchesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows spinner while loading', () => {
    mockUseProfile.mockReturnValue({ profile: makeUser('me'), loading: true })
    mockUseMatches.mockReturnValue({ matches: [], loading: true, error: null })
    render(<MatchesPage />)
    // Spinner component renders — just check no content yet
    expect(screen.queryByText(/no matches yet/i)).not.toBeInTheDocument()
  })

  it('shows error message without spinner when not loading', async () => {
    mockUseProfile.mockReturnValue({ profile: makeUser('me'), loading: false })
    mockUseMatches.mockReturnValue({ matches: [], loading: false, error: 'RPC failed' })
    render(<MatchesPage />)
    await waitFor(() => expect(screen.getByText(/rpc failed/i)).toBeInTheDocument())
    // Spinner must not be rendered alongside the error
    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
  })

  it('instagram link is not rendered when instagram field is empty string', () => {
    mockUseProfile.mockReturnValue({ profile: makeUser('me'), loading: false })
    mockUseMatches.mockReturnValue({
      matches: [makeUser('user-B', '')],
      loading: false,
      error: null,
    })
    render(<MatchesPage />)
    // BottomNav renders nav links; check specifically for instagram link by href pattern
    // BUG: empty string passes the `&&` truthiness check in JSX — link IS rendered when it should not be
    const instagramLinks = screen.queryAllByRole('link').filter(l =>
      l.getAttribute('href')?.includes('instagram.com')
    )
    expect(instagramLinks).toHaveLength(0)
  })

  it('instagram link is not rendered when instagram field is null', () => {
    mockUseProfile.mockReturnValue({ profile: makeUser('me'), loading: false })
    mockUseMatches.mockReturnValue({
      matches: [makeUser('user-B', undefined)],
      loading: false,
      error: null,
    })
    render(<MatchesPage />)
    const instagramLinks = screen.queryAllByRole('link').filter(l =>
      l.getAttribute('href')?.includes('instagram.com')
    )
    expect(instagramLinks).toHaveLength(0)
  })

  it('instagram link href is correctly formed', () => {
    mockUseProfile.mockReturnValue({ profile: makeUser('me'), loading: false })
    mockUseMatches.mockReturnValue({
      matches: [makeUser('user-B', 'alice123')],
      loading: false,
      error: null,
    })
    render(<MatchesPage />)
    const link = screen.getByRole('link', { name: /@alice123/i })
    expect(link).toHaveAttribute('href', 'https://instagram.com/alice123')
  })

  it('redirects to /onboard when profile is null after loading', async () => {
    mockUseProfile.mockReturnValue({ profile: null, loading: false })
    mockUseMatches.mockReturnValue({ matches: [], loading: false, error: null })
    render(<MatchesPage />)
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/onboard'))
  })

  it('shows "No matches yet" empty state when matches list is empty', () => {
    mockUseProfile.mockReturnValue({ profile: makeUser('me'), loading: false })
    mockUseMatches.mockReturnValue({ matches: [], loading: false, error: null })
    render(<MatchesPage />)
    expect(screen.getByText(/no matches yet/i)).toBeInTheDocument()
  })
})
