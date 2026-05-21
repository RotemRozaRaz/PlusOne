import imageCompression from 'browser-image-compression'

export async function compressPhoto(file: File): Promise<File> {
  try {
    return await imageCompression(file, {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 800,
      useWebWorker: false,
      fileType: 'image/jpeg',
      initialQuality: 0.85,
    })
  } catch {
    // Compression unavailable (e.g. iOS Lockdown Mode blocks Canvas) — upload original
    return file
  }
}
