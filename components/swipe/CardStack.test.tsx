import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CardStack from './CardStack'
import type { User } from '@/types'

// SwipeCard uses framer-motion — stub it to avoid canvas/animation issues in jsdom
vi.mock('./SwipeCard', () => ({
  default: vi.fn(({ profile, onSwipe, isTop }: { profile: User; onSwipe: (d: string) => void; isTop: boolean }) => (
    <div data-testid={`card-${profile.id}`}>
      <span>{profile.name}</span>
      {isTop && (
        <>
          <button onClick={() => onSwipe('left')}>Nope</button>
          <button onClick={() => onSwipe('right')}>Like</button>
        </>
      )}
    </div>
  )),
}))

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
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

describe('CardStack', () => {
  it('renders the top card with like/nope buttons', () => {
    const profiles = [makeUser('A'), makeUser('B')]
    const onSwipeEnd = vi.fn()
    render(<CardStack profiles={profiles} onSwipeEnd={onSwipeEnd} />)
    expect(screen.getByTestId('card-A')).toBeInTheDocument()
  })

  it('shows "All caught up!" empty state when queue is exhausted', () => {
    render(<CardStack profiles={[]} onSwipeEnd={vi.fn()} />)
    expect(screen.getByText(/all caught up/i)).toBeInTheDocument()
  })

  it('removes card from queue after swipe and calls onSwipeEnd', async () => {
    const profiles = [makeUser('A'), makeUser('B')]
    const onSwipeEnd = vi.fn()
    render(<CardStack profiles={profiles} onSwipeEnd={onSwipeEnd} />)

    // Click the card-level Like button (rendered by our mock inside card-A testid)
    const cardA = screen.getByTestId('card-A')
    fireEvent.click(cardA.querySelector('button:last-child')!)
    await waitFor(() => expect(screen.queryByTestId('card-A')).not.toBeInTheDocument())
    expect(onSwipeEnd).toHaveBeenCalledWith('right', 'A')
  })

  it('shows empty state after all cards are swiped', async () => {
    const profiles = [makeUser('A')]
    render(<CardStack profiles={profiles} onSwipeEnd={vi.fn()} />)
    // Use the text label from our mock's Nope button
    const nopeBtn = screen.getByText('Nope')
    fireEvent.click(nopeBtn)
    await waitFor(() => expect(screen.getByText(/all caught up/i)).toBeInTheDocument())
  })

  it('renders at most 3 visible cards from the queue', () => {
    const profiles = [makeUser('A'), makeUser('B'), makeUser('C'), makeUser('D'), makeUser('E')]
    render(<CardStack profiles={profiles} onSwipeEnd={vi.fn()} />)
    // Only first 3 visible
    expect(screen.getByTestId('card-A')).toBeInTheDocument()
    expect(screen.getByTestId('card-B')).toBeInTheDocument()
    expect(screen.getByTestId('card-C')).toBeInTheDocument()
    expect(screen.queryByTestId('card-D')).not.toBeInTheDocument()
  })
})
