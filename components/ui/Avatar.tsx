import { cn } from '@/lib/cn'

interface Props {
  src: string
  name: string
  size?: number
  className?: string
}

export default function Avatar({ src, name, size = 48, className }: Props) {
  const initials = name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div
      className={cn('relative rounded-full overflow-hidden bg-blush flex items-center justify-center', className)}
      style={{ width: size, height: size, minWidth: size }}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span className="font-display text-slate-600 font-semibold" style={{ fontSize: size * 0.35 }}>
          {initials}
        </span>
      )}
    </div>
  )
}
