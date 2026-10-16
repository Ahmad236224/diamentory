"use client";

import { useEffect } from "react";

const SELECTOR = ".reveal, .reveal-mask, .reveal-stagger";

/**
 * One observer for the whole site:
 *  - adds `.is-in` to .reveal / .reveal-mask / .reveal-stagger as they enter the viewport (once);
 *  - sets `--p` (0 → 1) on visible `.drift` frames for a subtle, transform-only image drift.
 * Content is hidden only after `js-reveal` is set on <html>, so it's never lost without JS.
 *
 * Scans run at idle time: the layout hydrates before streamed page segments, and touching their
 * classes before React has hydrated them causes hydration mismatches. Nothing is hidden until the
 * first scan, and anything already on screen at that point is shown immediately (no flash).
 */
const hasIdle = () => typeof window.requestIdleCallback === "function";
const idle = (fn: () => void): number =>
  hasIdle() ? window.requestIdleCallback(fn, { timeout: 1200 }) : window.setTimeout(fn, 150);
const cancelIdle = (id: number) => (hasIdle() ? window.cancelIdleCallback(id) : window.clearTimeout(id));

export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const visibleDrift = new Set<HTMLElement>();
    const driftIo = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visibleDrift.add(e.target as HTMLElement);
        else visibleDrift.delete(e.target as HTMLElement);
      }
      schedule();
    });

    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (const el of visibleDrift) {
        const r = el.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
        el.style.setProperty("--p", p.toFixed(3));
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const scan = (scope: ParentNode) => {
      scope.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
        if (el.classList.contains("is-in")) return;
        // already on screen at load → show immediately, no flash
        const r = el.getBoundingClientRect();
        if (reduce || (r.top < window.innerHeight && r.bottom > 0 && !el.dataset.revealWait)) {
          el.classList.add("is-in");
        } else {
          io.observe(el);
        }
      });
      if (!reduce) scope.querySelectorAll<HTMLElement>(".drift").forEach((el) => driftIo.observe(el));
    };

    const first = idle(() => {
      scan(document);
      root.classList.add("js-reveal");
    });

    // new content after client navigation / streaming (scanned once React has hydrated it)
    const pending = new Set<ParentNode>();
    let pendingId = 0;
    const mo = new MutationObserver((muts) => {
      for (const m of muts) m.addedNodes.forEach((n) => n instanceof HTMLElement && pending.add(n.parentNode ?? n));
      if (pending.size && !pendingId)
        pendingId = idle(() => {
          pendingId = 0;
          pending.forEach((n) => scan(n));
          pending.clear();
        });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      cancelIdle(first);
      if (pendingId) cancelIdle(pendingId);
      io.disconnect();
      driftIo.disconnect();
      mo.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
