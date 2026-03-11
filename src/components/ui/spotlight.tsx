'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import type { SpringOptions } from 'framer-motion';
import { cn } from '@/lib/utils';

type SpotlightProps = {
  className?: string;
  size?: number;
  springOptions?: SpringOptions;
};

export function Spotlight({
  className,
  size = 300,
  springOptions = { bounce: 0 },
}: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [parentElement, setParentElement] = useState<HTMLElement | null>(null);

  const mouseX = useSpring(0, springOptions);
  const mouseY = useSpring(0, springOptions);

  const innerSize = size * 0.4;

  const spotlightLeft  = useTransform(mouseX, (x) => `${x - size / 2}px`);
  const spotlightTop   = useTransform(mouseY, (y) => `${y - size / 2}px`);
  const innerLeft      = useTransform(mouseX, (x) => `${x - innerSize / 2}px`);
  const innerTop       = useTransform(mouseY, (y) => `${y - innerSize / 2}px`);

  useEffect(() => {
    if (containerRef.current) {
      const parent = containerRef.current.parentElement;
      if (parent) {
        parent.style.position = 'relative';
        parent.style.overflow = 'hidden';
        setParentElement(parent);
      }
    }
  }, []);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!parentElement) return;
      const { left, top } = parentElement.getBoundingClientRect();
      mouseX.set(event.clientX - left);
      mouseY.set(event.clientY - top);
    },
    [mouseX, mouseY, parentElement],
  );

  useEffect(() => {
    if (!parentElement) return;
    const onEnter = () => setIsHovered(true);
    const onLeave = () => setIsHovered(false);

    parentElement.addEventListener('mousemove', handleMouseMove);
    parentElement.addEventListener('mouseenter', onEnter);
    parentElement.addEventListener('mouseleave', onLeave);

    return () => {
      parentElement.removeEventListener('mousemove', handleMouseMove);
      parentElement.removeEventListener('mouseenter', onEnter);
      parentElement.removeEventListener('mouseleave', onLeave);
    };
  }, [parentElement, handleMouseMove]);

  return (
    <>
      {/* Outer wide halo — soft ambient glow */}
      <motion.div
        ref={containerRef}
        className={cn(
          'pointer-events-none absolute rounded-full transition-opacity duration-500',
          isHovered ? 'opacity-100' : 'opacity-0',
          className,
        )}
        style={{
          width: size,
          height: size,
          left: spotlightLeft,
          top: spotlightTop,
          background:
            'radial-gradient(circle at center, rgba(200,96,42,0.12) 0%, rgba(200,96,42,0.05) 45%, transparent 75%)',
          filter: 'blur(40px)',
        }}
      />
      {/* Inner focused beam — brighter core */}
      <motion.div
        className={cn(
          'pointer-events-none absolute rounded-full transition-opacity duration-300',
          isHovered ? 'opacity-100' : 'opacity-0',
        )}
        style={{
          width: size * 0.4,
          height: size * 0.4,
          left: innerLeft,
          top: innerTop,
          background:
            'radial-gradient(circle at center, rgba(232,137,90,0.22) 0%, rgba(200,96,42,0.10) 50%, transparent 80%)',
          filter: 'blur(18px)',
        }}
      />
    </>
  );
}
