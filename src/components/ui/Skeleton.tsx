import { cn } from '../../utils/cn'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-primary/5 border border-primary/5',
        className
      )}
    />
  )
}

export function PropertyCardSkeleton() {
  return (
    <div className="rounded-[2rem] overflow-hidden border border-primary/5 bg-white shadow-sm flex flex-col">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="p-6 space-y-4">
        <div className="flex justify-between gap-4">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-7 w-3/4 rounded-xl" />
            <Skeleton className="h-4 w-1/2 rounded-lg" />
          </div>
          <div className="space-y-1">
             <Skeleton className="h-7 w-16 rounded-xl" />
             <Skeleton className="h-3 w-10 ml-auto rounded-lg" />
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-16 rounded-lg" />
          <Skeleton className="h-6 w-16 rounded-lg" />
          <Skeleton className="h-6 w-16 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export function ServiceCardSkeleton() {
  return (
    <div className="rounded-[2rem] p-8 border border-white/40 bg-white/60 shadow-xl space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-16 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32 rounded-md" />
            <Skeleton className="h-3 w-20 rounded-sm" />
          </div>
        </div>
        <Skeleton className="w-16 h-8 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-4/5 rounded-md" />
      </div>
      <div className="flex gap-3 pt-4">
        <Skeleton className="flex-1 h-12 rounded-xl" />
        <Skeleton className="w-12 h-12 rounded-xl" />
      </div>
    </div>
  )
}
