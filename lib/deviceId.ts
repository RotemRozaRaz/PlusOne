const KEY = 'plus_one_device_id'

export function getOrCreateDeviceId(): string {
  let id = localStorage.getItem(KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(KEY, id)
  }
  return id
}

export function clearDeviceId(): void {
  localStorage.removeItem('plus_one_device_id')
  localStorage.removeItem('plus_one_user_id')
}
