import { cn } from '@/lib/cn'

export default function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'w-8 h-8 rounded-full border-2 border-blush border-t-gold animate-spin mx-auto',
        className
      )}
    />
  )
}
