"use client";

import { useRef, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

/**
 * Breathing icosahedron with:
 *  - Solid dark body + terracotta edge lines
 *  - Sine-wave breathing (scale oscillation)
 *  - Mouse-reactive tilt (lerped for smoothness)
 *  - Slow axis rotation
 *  - GSAP entrance: scale 0 → 1 with elastic.out
 */
function BreathingGeometry() {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  // Shared geometry for both solid mesh and edge lines
  const geo = useMemo(() => new THREE.IcosahedronGeometry(1.4, 1), []);
  const edgesGeo = useMemo(() => new THREE.EdgesGeometry(geo), [geo]);

  // Materials
  const solidMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#2a3240",
        emissive: "#c8602a",
        emissiveIntensity: 0.12,
        metalness: 0.5,
        roughness: 0.35,
      }),
    [],
  );

  const edgeMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: "#c8602a",
        transparent: true,
        opacity: 0.75,
      }),
    [],
  );

  // GSAP entrance: scale 0 → 1
  useEffect(() => {
    const g = groupRef.current;
    if (!g) return;
    g.scale.setScalar(0);
    gsap.to(g.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1.2,
      ease: "elastic.out(1, 0.5)",
      delay: 0.3,
    });
  }, []);

  // Per-frame animation
  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;

    const t = state.clock.getElapsedTime();

    // Breathing — slow sine oscillation
    const breathScale = 1 + Math.sin(t * 0.7) * 0.045;
    // Apply on top of the entrance scale (only once it's visible)
    if (g.scale.x > 0.5) {
      g.scale.setScalar(breathScale);
    }

    // Slow base rotation
    g.rotation.y += 0.0015;
    g.rotation.x += 0.0005;

    // Mouse-reactive tilt (lerped for smooth follow)
    g.rotation.x += (mouse.y * 0.25 - g.rotation.x) * 0.04;
    g.rotation.y += (mouse.x * 0.25 - g.rotation.y) * 0.04;
  });

  return (
    <group ref={groupRef}>
      {/* Solid body */}
      <mesh geometry={geo} material={solidMat} />
      {/* Terracotta edge lines */}
      <lineSegments geometry={edgesGeo} material={edgeMat} />
    </group>
  );
}

/**
 * Full R3F scene — lighting, environment, geometry, shadows.
 */
export function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#f5f0e8" />
      <pointLight position={[-5, -2, -5]} intensity={0.6} color="#c8602a" />

      <BreathingGeometry />

      <ContactShadows
        position={[0, -2.2, 0]}
        opacity={0.25}
        scale={8}
        blur={2.5}
        color="#c8602a"
      />

      <Environment preset="sunset" />
    </>
  );
}
