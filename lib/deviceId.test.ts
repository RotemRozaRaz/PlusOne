import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getOrCreateDeviceId, clearDeviceId } from './deviceId'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

describe('getOrCreateDeviceId', () => {
  beforeEach(() => {
    localStorage.clear()
    // Ensure crypto.randomUUID is available in jsdom
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('00000000-0000-4000-8000-000000000001' as `${string}-${string}-${string}-${string}-${string}`)
  })

  it('returns the same UUID across multiple calls (persists to localStorage)', () => {
    const first = getOrCreateDeviceId()
    const second = getOrCreateDeviceId()
    expect(first).toBe(second)
  })

  it('generates a valid UUID v4 format', () => {
    vi.restoreAllMocks()
    const id = getOrCreateDeviceId()
    expect(id).toMatch(UUID_REGEX)
  })

  it('stores the generated id under the correct localStorage key', () => {
    const id = getOrCreateDeviceId()
    expect(localStorage.getItem('plus_one_device_id')).toBe(id)
  })

  it('reuses an existing id from localStorage without calling randomUUID again', () => {
    vi.clearAllMocks() // reset call count before this assertion
    localStorage.setItem('plus_one_device_id', 'existing-id')
    const id = getOrCreateDeviceId()
    expect(id).toBe('existing-id')
    expect(crypto.randomUUID).not.toHaveBeenCalled()
  })
})

describe('clearDeviceId', () => {
  it('removes plus_one_device_id from localStorage', () => {
    localStorage.setItem('plus_one_device_id', 'abc')
    clearDeviceId()
    expect(localStorage.getItem('plus_one_device_id')).toBeNull()
  })

  it('removes plus_one_user_id from localStorage', () => {
    localStorage.setItem('plus_one_user_id', 'xyz')
    clearDeviceId()
    expect(localStorage.getItem('plus_one_user_id')).toBeNull()
  })

  it('removes both keys in one call', () => {
    localStorage.setItem('plus_one_device_id', 'abc')
    localStorage.setItem('plus_one_user_id', 'xyz')
    clearDeviceId()
    expect(localStorage.getItem('plus_one_device_id')).toBeNull()
    expect(localStorage.getItem('plus_one_user_id')).toBeNull()
  })
})
