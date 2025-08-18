// components/products/ProductCardSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

export function ProductCardSkeleton({ viewMode }: { viewMode: 'grid' | 'list' }) {
  return viewMode === 'grid' ? (
    <div className="space-y-4">
      <Skeleton className="h-48 w-full rounded-t-lg" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-4 w-3/4" />
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-4 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-6 w-1/2" />
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex space-x-4 p-6">
      <Skeleton className="h-24 w-24 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-4 rounded-full" />
          ))}
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
  );
}