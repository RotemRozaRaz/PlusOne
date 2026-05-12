import { cn } from '@/lib/cn'
import { ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: Props) {
  return (
    <button
      className={cn(
        'rounded-full font-body font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
        size === 'sm' && 'px-4 py-2 text-sm',
        size === 'md' && 'px-6 py-3 text-base',
        size === 'lg' && 'px-8 py-4 text-lg',
        variant === 'primary' && 'bg-gold text-white shadow-card',
        variant === 'ghost' && 'bg-white/60 border border-blush text-slate-700',
        variant === 'danger' && 'bg-red-500 text-white',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
