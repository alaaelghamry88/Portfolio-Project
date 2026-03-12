"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { toast } from "sonner";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

const schema = z.object({
  name:    z.string().min(2, "Name must be at least 2 characters"),
  email:   z.string().email("Enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

type FormState = "idle" | "loading" | "success" | "error";

const inputClass = cn(
  "w-full px-4 py-3 rounded-xl font-body text-sm text-foreground",
  "bg-card border border-border",
  "placeholder:text-muted-foreground",
  "focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/40",
  "transition-colors duration-200",
  "disabled:opacity-50 disabled:cursor-not-allowed",
);

export function ContactForm() {
  const formRef    = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<FormState>("idle");

  const prefersReduced = usePrefersReducedMotion();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { contextSafe } = useGSAP({ scope: formRef });

  const showSuccess = contextSafe(() => {
    if (prefersReduced) {
      if (formRef.current)    formRef.current.style.display = "none";
      if (successRef.current) successRef.current.style.opacity = "1";
      return;
    }
    gsap.to(formRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.5,
      ease: "power3.out",
      onComplete: () => {
        if (formRef.current) formRef.current.style.display = "none";
        gsap.fromTo(
          successRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        );
      },
    });
  });

  const onSubmit = async (data: FormData) => {
    setState("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "send_failed");
      }

      setState("success");
      showSuccess();
    } catch {
      setState("error");
      toast.error("Couldn't send your message. Please try emailing directly.");
      setState("idle");
    }
  };

  const isLoading = state === "loading";

  return (
    <div className="relative">
      <div
        ref={successRef}
        className="absolute inset-0 flex flex-col items-center justify-center gap-4 opacity-0 pointer-events-none"
        aria-live="polite"
      >
        <span className="text-4xl" aria-hidden="true">👋</span>
        <h3 className="font-display font-bold text-2xl text-foreground">Message sent.</h3>
        <p className="font-body text-muted-foreground text-center">I&apos;ll be in touch soon.</p>
      </div>
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Name</label>
          <input id="name" type="text" placeholder="Your name" className={inputClass} disabled={isLoading} {...register("name")} />
          {errors.name && <p className="font-mono text-xs text-red-400">{errors.name.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Email</label>
          <input id="email" type="email" placeholder="your@email.com" className={inputClass} disabled={isLoading} {...register("email")} />
          {errors.email && <p className="font-mono text-xs text-red-400">{errors.email.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="message" className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Message</label>
          <textarea id="message" rows={5} placeholder="What are you working on?" className={cn(inputClass, "resize-none")} disabled={isLoading} {...register("message")} />
          {errors.message && <p className="font-mono text-xs text-red-400">{errors.message.message}</p>}
        </div>
        <MagneticButton>
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "w-full px-6 py-3.5 rounded-full font-body font-medium text-sm",
              "bg-terracotta text-paper",
              "transition-colors duration-200",
              "hover:bg-terracotta-light",
              "disabled:opacity-60 disabled:cursor-not-allowed",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2",
            )}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeLinecap="round" />
                </svg>
                Sending…
              </span>
            ) : (
              "Send it →"
            )}
          </button>
        </MagneticButton>
      </form>
    </div>
  );
}
