// src/components/experience/ExperienceAccordion.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import type { Experience } from "@/data/experience";
import { ExperienceItem, type ExperienceItemHandle } from "./ExperienceItem";

interface Props {
  experiences: Experience[];
  defaultOpenFirst?: boolean;
}

export function ExperienceAccordion({ experiences, defaultOpenFirst }: Props) {
  const [openId, setOpenId]   = useState<string | null>(null);
  const openIdRef             = useRef<string | null>(null);
  const itemRefs              = useRef<(ExperienceItemHandle | null)[]>([]);

  // Keep ref in sync so toggle callbacks aren't stale
  openIdRef.current = openId;

  // Open first item once section enters viewport
  useEffect(() => {
    if (!defaultOpenFirst || experiences.length === 0) return;
    const firstId  = experiences[0].id;
    setOpenId(firstId);
    itemRefs.current[0]?.open();
  }, [defaultOpenFirst, experiences]);

  function toggle(id: string, index: number) {
    const currentId    = openIdRef.current;
    const currentIndex = experiences.findIndex((e) => e.id === currentId);

    if (currentId === id) {
      // Same item — close it
      setOpenId(null);
      itemRefs.current[index]?.close();
      return;
    }

    if (currentId === null) {
      // Nothing open — open directly
      setOpenId(id);
      itemRefs.current[index]?.open();
      return;
    }

    // Another item open — close it first, then open new in onComplete
    itemRefs.current[currentIndex]?.close(() => {
      setOpenId(id);
      itemRefs.current[index]?.open();
    });
  }

  return (
    <div>
      {experiences.map((exp, i) => (
        <ExperienceItem
          key={exp.id}
          ref={(el) => { itemRefs.current[i] = el; }}
          experience={exp}
          index={i}
          isOpen={openId === exp.id}
          onToggle={() => toggle(exp.id, i)}
        />
      ))}
    </div>
  );
}
