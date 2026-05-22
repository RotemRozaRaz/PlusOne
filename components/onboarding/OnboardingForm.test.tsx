import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OnboardingForm from './OnboardingForm'

// Mock Next.js router
const mockReplace = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}))

// Mock framer-motion to render children immediately without animations
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// Mock Supabase client
const mockUpload = vi.fn().mockResolvedValue({ error: null })
const mockGetPublicUrl = vi.fn().mockReturnValue({ data: { publicUrl: 'https://cdn.example.com/photo.jpg' } })
const mockInsert = vi.fn().mockResolvedValue({ error: null })
const mockFrom = vi.fn(() => ({ insert: mockInsert }))
const mockStorageFrom = vi.fn(() => ({ upload: mockUpload, getPublicUrl: mockGetPublicUrl }))
const mockRpc = vi.fn().mockResolvedValue({ data: null, error: null })

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: mockFrom,
    storage: { from: mockStorageFrom },
    rpc: mockRpc,
  }),
}))

// Mock deviceId
vi.mock('@/lib/deviceId', () => ({
  getOrCreateDeviceId: () => 'test-device-id',
}))

// Mock image compression
vi.mock('@/lib/imageCompression', () => ({
  compressPhoto: (file: File) => Promise.resolve(file),
}))

// Mock crypto.randomUUID
vi.stubGlobal('crypto', {
  randomUUID: () => 'test-uuid-1234',
})

function makeFile(name = 'photo.jpg', type = 'image/jpeg'): File {
  return new File([new Uint8Array(10)], name, { type })
}

describe('OnboardingForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders the name step first', () => {
    render(<OnboardingForm />)
    expect(screen.getByText(/what's your name/i)).toBeInTheDocument()
  })

  it('Continue button is disabled when name is empty', () => {
    render(<OnboardingForm />)
    const continueBtn = screen.getByRole('button', { name: /continue/i })
    expect(continueBtn).toBeDisabled()
  })

  it('empty name cannot advance past NameStep', async () => {
    render(<OnboardingForm />)
    const input = screen.getByPlaceholderText(/your first name/i)
    await userEvent.type(input, '   ')
    const continueBtn = screen.getByRole('button', { name: /continue/i })
    expect(continueBtn).toBeDisabled()
  })

  it('advances to instagram step after valid name is entered', async () => {
    render(<OnboardingForm />)
    const input = screen.getByPlaceholderText(/your first name/i)
    await userEvent.type(input, 'Alice')
    await userEvent.click(screen.getByRole('button', { name: /continue/i }))
    expect(screen.getByText(/instagram handle/i)).toBeInTheDocument()
  })

  it('strips @ prefix from instagram handle before storing', async () => {
    render(<OnboardingForm />)
    // advance to instagram step
    await userEvent.type(screen.getByPlaceholderText(/your first name/i), 'Alice')
    await userEvent.click(screen.getByRole('button', { name: /continue/i }))

    const igInput = screen.getByPlaceholderText(/yourhandle/i)
    await userEvent.type(igInput, '@alice123')
    await userEvent.click(screen.getByRole('button', { name: /continue/i }))

    // advance to photo step and submit
    expect(screen.getByText(/add your photo/i)).toBeInTheDocument()
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    fireEvent.change(fileInput, { target: { files: [makeFile()] } })
    await userEvent.click(screen.getByRole('button', { name: /let's go/i }))

    await waitFor(() => {
      const insertCall = mockInsert.mock.calls[0][0]
      // instagram should not start with @
      expect(insertCall.instagram).not.toMatch(/^@/)
      expect(insertCall.instagram).toBe('alice123')
    })
  })

  it('handleSubmit is a no-op when photoFile is null (submit button not shown)', async () => {
    render(<OnboardingForm />)
    await userEvent.type(screen.getByPlaceholderText(/your first name/i), 'Alice')
    await userEvent.click(screen.getByRole('button', { name: /continue/i }))
    await userEvent.click(screen.getByRole('button', { name: /continue/i }))

    // At photo step — no file selected, so submit button should not appear
    expect(screen.queryByRole('button', { name: /let's go/i })).not.toBeInTheDocument()
    expect(mockInsert).not.toHaveBeenCalled()
  })

  it('does not fire a second insert while isSubmitting is true', async () => {
    // Make insert hang indefinitely on first call
    let resolveInsert!: () => void
    mockInsert.mockReturnValueOnce(new Promise(res => { resolveInsert = () => res({ error: null }) }))

    render(<OnboardingForm />)
    await userEvent.type(screen.getByPlaceholderText(/your first name/i), 'Alice')
    await userEvent.click(screen.getByRole('button', { name: /continue/i }))
    await userEvent.click(screen.getByRole('button', { name: /continue/i }))

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    fireEvent.change(fileInput, { target: { files: [makeFile()] } })

    const submitBtn = screen.getByRole('button', { name: /let's go/i })
    await userEvent.click(submitBtn)
    // Button should now be disabled (isSubmitting = true)
    await waitFor(() => expect(submitBtn).toBeDisabled())

    // Clicking again must not fire another insert
    await userEvent.click(submitBtn)
    expect(mockInsert).toHaveBeenCalledTimes(1)

    resolveInsert()
  })

  it('stores user_id in localStorage and redirects to /swipe on success', async () => {
    render(<OnboardingForm />)
    await userEvent.type(screen.getByPlaceholderText(/your first name/i), 'Alice')
    await userEvent.click(screen.getByRole('button', { name: /continue/i }))
    await userEvent.click(screen.getByRole('button', { name: /continue/i }))

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    fireEvent.change(fileInput, { target: { files: [makeFile()] } })
    await userEvent.click(screen.getByRole('button', { name: /let's go/i }))

    await waitFor(() => {
      expect(localStorage.getItem('plus_one_user_id')).toBe('test-uuid-1234')
      expect(mockReplace).toHaveBeenCalledWith('/swipe')
    })
  })
})
