'use client'

import { Suspense, lazy } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <span className="block w-3 h-3 rounded-full bg-terracotta animate-pulse" />
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  )
}
