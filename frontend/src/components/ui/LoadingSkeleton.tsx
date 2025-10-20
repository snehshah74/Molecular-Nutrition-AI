import { motion } from 'framer-motion'

interface LoadingSkeletonProps {
  className?: string
  height?: string
  width?: string
}

export function LoadingSkeleton({ className = "", height = "h-4", width = "w-full" }: LoadingSkeletonProps) {
  return (
    <motion.div
      className={`bg-gray-200 dark:bg-gray-700 rounded ${height} ${width} ${className}`}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="card p-6 space-y-4">
      <LoadingSkeleton height="h-6" width="w-3/4" />
      <LoadingSkeleton height="h-4" width="w-full" />
      <LoadingSkeleton height="h-4" width="w-5/6" />
      <div className="flex space-x-2">
        <LoadingSkeleton height="h-8" width="w-20" />
        <LoadingSkeleton height="h-8" width="w-24" />
      </div>
    </div>
  )
}

export function RecommendationSkeleton() {
  return (
    <div className="card p-6">
      <div className="flex items-start space-x-4">
        <LoadingSkeleton height="h-12" width="w-12" className="rounded-full" />
        <div className="flex-1 space-y-3">
          <div className="flex items-center space-x-2">
            <LoadingSkeleton height="h-5" width="w-32" />
            <LoadingSkeleton height="h-6" width="w-16" className="rounded-full" />
          </div>
          <LoadingSkeleton height="h-4" width="w-full" />
          <LoadingSkeleton height="h-4" width="w-4/5" />
          <div className="flex space-x-2">
            <LoadingSkeleton height="h-6" width="w-20" className="rounded-full" />
            <LoadingSkeleton height="h-6" width="w-24" className="rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
