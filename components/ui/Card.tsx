import { cn } from '@/lib/cn'

export default function Card({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('bg-white rounded-card shadow-card p-6', className)}>
      {children}
    </div>
  )
}
