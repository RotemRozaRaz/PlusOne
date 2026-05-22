'use client'

import Link from 'next/link'
import { cn } from '@/lib/cn'

type Tab = 'swipe' | 'singles' | 'matches' | 'profile'

const tabs: { id: Tab; label: string; icon: string; href: string }[] = [
  { id: 'swipe',   label: 'Swipe',   icon: '🔥', href: '/swipe'   },
  { id: 'singles', label: 'Singles', icon: '👥', href: '/singles' },
  { id: 'matches', label: 'Matches', icon: '💌', href: '/matches' },
  { id: 'profile', label: 'Profile', icon: '👤', href: '/profile' },
]

export default function BottomNav({ active }: { active: Tab }) {
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-md border-t border-blush pb-safe z-40">
      <div className="flex">
        {tabs.map(tab => (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              'flex-1 flex flex-col items-center gap-1 py-3 text-xs font-body transition-colors',
              active === tab.id ? 'text-gold' : 'text-slate-400'
            )}
          >
            <span className="text-xl leading-none">{tab.icon}</span>
            <span>{tab.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
