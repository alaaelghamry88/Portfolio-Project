'use client'

import { Suspense, lazy } from 'react'
import type { Application } from '@splinetool/runtime'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  function handleLoad(spline: Application) {
    // Transparent so the WebGL shader background shows through
    spline.setBackgroundColor('transparent')
  }

  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <span className="block w-3 h-3 rounded-full bg-terracotta animate-pulse" />
        </div>
      }
    >
      <Spline
        scene={scene}
        className={className}
        // Let Spline render on demand instead of every frame
        renderOnDemand
        onLoad={handleLoad}
      />
    </Suspense>
  )
}
