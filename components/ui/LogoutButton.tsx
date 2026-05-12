'use client'

import { clearDeviceId } from '@/lib/deviceId'

export default function LogoutButton() {
  function handleLogout() {
    clearDeviceId()
    window.location.href = '/onboard'
  }
  return (
    <button
      onClick={handleLogout}
      className="text-xs text-slate-400 hover:text-slate-600 transition-colors px-2 py-1"
    >
      Log out
    </button>
  )
}
