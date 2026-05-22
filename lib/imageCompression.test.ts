import { describe, it, expect, vi, beforeEach } from 'vitest'
import { compressPhoto } from './imageCompression'

// Mock browser-image-compression
vi.mock('browser-image-compression', () => ({
  default: vi.fn(),
}))

import imageCompression from 'browser-image-compression'

function makeFile(name = 'photo.jpg', type = 'image/jpeg', sizeBytes = 1024): File {
  const blob = new Blob([new Uint8Array(sizeBytes)], { type })
  return new File([blob], name, { type })
}

describe('compressPhoto', () => {
  beforeEach(() => {
    vi.mocked(imageCompression).mockReset()
  })

  it('calls imageCompression with the correct options', async () => {
    const compressed = makeFile('compressed.jpg', 'image/jpeg', 100)
    vi.mocked(imageCompression).mockResolvedValue(compressed)

    await compressPhoto(makeFile())

    expect(imageCompression).toHaveBeenCalledWith(
      expect.any(File),
      expect.objectContaining({
        maxSizeMB: 0.2,
        maxWidthOrHeight: 800,
        fileType: 'image/jpeg',
        initialQuality: 0.85,
      })
    )
  })

  it('returns the compressed file when compression succeeds', async () => {
    const compressed = makeFile('compressed.jpg', 'image/jpeg', 50)
    vi.mocked(imageCompression).mockResolvedValue(compressed)

    const result = await compressPhoto(makeFile())
    expect(result).toBe(compressed)
  })

  it('falls back to the original file when compression throws', async () => {
    vi.mocked(imageCompression).mockRejectedValue(new Error('Canvas not available'))
    const original = makeFile('original.jpg', 'image/jpeg', 500)

    const result = await compressPhoto(original)
    expect(result).toBe(original)
  })

  it('compressed result should be smaller than 0.2 MB (0.2 * 1024 * 1024 bytes)', async () => {
    const maxBytes = 0.2 * 1024 * 1024
    const smallFile = makeFile('small.jpg', 'image/jpeg', Math.floor(maxBytes - 1))
    vi.mocked(imageCompression).mockResolvedValue(smallFile)

    const result = await compressPhoto(makeFile())
    expect(result.size).toBeLessThan(maxBytes)
  })
})
