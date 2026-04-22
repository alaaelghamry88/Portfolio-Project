"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function Avatar() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError,  setImgError]  = useState(false);

  const prefersReduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReduced) return;
      gsap.fromTo(
        containerRef.current,
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: containerRef.current, start: "top 75%" },
        },
      );
    },
    { scope: containerRef, dependencies: [prefersReduced] },
  );

  const showImage = imgLoaded && !imgError;

  return (
    <div
      ref={containerRef}
      className="relative aspect-square max-w-[400px] w-full rounded-2xl overflow-hidden"
      style={{ opacity: prefersReduced ? 1 : 0 }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center bg-steel"
        aria-hidden={showImage}
      >
        <span className="font-display font-bold text-7xl text-terracotta select-none">
          AE
        </span>
      </div>
      {!imgError && (
        <Image
          src="/images/avatar/Alaa-Elghamry.jpeg"
          alt="Alaa Elghamry"
          width={400}
          height={400}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: showImage ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
        />
      )}
    </div>
  );
}
