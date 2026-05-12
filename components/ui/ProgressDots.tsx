import { cn } from '@/lib/cn'

interface Props {
  total: number
  current: number
}

export default function ProgressDots({ total, current }: Props) {
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'rounded-full transition-all duration-300',
            i === current ? 'w-6 h-2 bg-gold' : 'w-2 h-2 bg-blush'
          )}
        />
      ))}
    </div>
  )
}
