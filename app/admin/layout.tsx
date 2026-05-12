import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createHash } from 'crypto'

function getExpectedToken() {
  const password = process.env.ADMIN_PASSWORD ?? ''
  return createHash('sha256').update(password).digest('hex')
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = headers().get('x-pathname') ?? ''

  // Don't apply auth check or admin chrome to the login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const session = cookies().get('admin_session')
  if (!session || session.value !== getExpectedToken()) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-dvh bg-ivory">
      <header className="bg-white border-b border-blush px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-slate-800">Plus One Admin</h1>
          <p className="text-slate-400 text-xs font-body">Event Management</p>
        </div>
        <a
          href="/swipe"
          className="text-sm text-gold underline underline-offset-2 font-body"
        >
          ← Back to app
        </a>
      </header>
      {children}
    </div>
  )
}
