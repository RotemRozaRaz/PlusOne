'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CookiesBadge() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const cookiesAccepted = localStorage.getItem('cookies-accepted')
    if (!cookiesAccepted) {
      setShowBanner(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookies-accepted', 'true')
    setShowBanner(false)
  }

  if (!showBanner) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-800 text-white p-4 shadow-lg z-50">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm">
          We use cookies to enhance your experience. By continuing to browse, you agree to our{' '}
          <Link href="/privacy" className="underline hover:text-slate-200">
            privacy policy
          </Link>
          .
        </p>
        <button
          onClick={handleAccept}
          className="whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Accept
        </button>
      </div>
    </div>
  )
}
