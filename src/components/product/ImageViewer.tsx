"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import clsx from "clsx";
import type { Finish, Product } from "@/lib/catalog/types";
import { Dialog } from "@/components/ui/Dialog";
import { IconChevron, IconClose, IconMinus, IconPlus } from "@/components/ui/icons";
import { ProductMedia } from "./ProductMedia";

const N = 4;
const MAX_ZOOM = 4;
const TAP_ZOOM = 2.5;
const RATIO = 4 / 5;
const LABEL = ["Front", "Detail", "Angle", "On dark"];

/** Full-screen viewer: tap/click to zoom, pinch, drag/scroll to pan, arrows + Esc. */
export function ImageViewer({
  product,
  finish,
  index,
  onIndex,
  onClose,
}: {
  product: Product;
  finish: Finish;
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const open = index !== null;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      side="center"
      tone="dark"
      hideTitle
      label={`${product.name} — image viewer`}
      className="!m-0 !h-dvh !max-h-dvh !w-full !max-w-none"
    >
      {open && <Stage product={product} finish={finish} index={index} onIndex={onIndex} onClose={onClose} />}
    </Dialog>
  );
}

function Stage({
  product,
  finish,
  index,
  onIndex,
  onClose,
}: {
  product: Product;
  finish: Finish;
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [zoom, setZoom] = useState(1);
  const focus = useRef<{ fx: number; fy: number; sx: number; sy: number } | null>(null);
  const drag = useRef<{ x: number; y: number; l: number; t: number; moved: boolean } | null>(null);

  const go = (d: number) => {
    setZoom(1);
    onIndex((index + d + N) % N);
  };

  // measure the stage
  useLayoutEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // base box fits the stage at 4:5
  const baseW = Math.min(size.w, size.h * RATIO);
  const baseH = baseW / RATIO;
  const boxW = baseW * zoom;
  const boxH = baseH * zoom;
  const innerW = Math.max(size.w, boxW);
  const innerH = Math.max(size.h, boxH);

  /** Zoom keeping the point (fx, fy) — fractions of the image — under screen point (sx, sy). */
  const zoomAt = (z: number, fx = 0.5, fy = 0.5, sx = size.w / 2, sy = size.h / 2) => {
    focus.current = { fx, fy, sx, sy };
    setZoom(Math.min(MAX_ZOOM, Math.max(1, z)));
  };

  useLayoutEffect(() => {
    const el = stage.current;
    const f = focus.current;
    if (!el || !f) return;
    const offX = (innerW - boxW) / 2;
    const offY = (innerH - boxH) / 2;
    el.scrollLeft = offX + f.fx * boxW - f.sx;
    el.scrollTop = offY + f.fy * boxH - f.sy;
    focus.current = null;
  }, [zoom, boxW, boxH, innerW, innerH]);

  /** Fraction of the image under a client point. */
  const pointAt = (cx: number, cy: number) => {
    const el = stage.current!;
    const r = el.getBoundingClientRect();
    const sx = cx - r.left;
    const sy = cy - r.top;
    const offX = (innerW - boxW) / 2;
    const offY = (innerH - boxH) / 2;
    return {
      fx: Math.min(1, Math.max(0, (el.scrollLeft + sx - offX) / boxW)),
      fy: Math.min(1, Math.max(0, (el.scrollTop + sy - offY) / boxH)),
      sx,
      sy,
    };
  };

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "+" || e.key === "=") zoomAt(zoom + 0.75);
      else if (e.key === "-") zoomAt(zoom - 0.75);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // pinch-to-zoom + swipe (touch). Non-passive so the page itself never zooms.
  const latest = useRef({ zoom, pointAt, zoomAt, go });
  useLayoutEffect(() => {
    latest.current = { zoom, pointAt, zoomAt, go };
  });
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    let pinch: { d: number; z: number } | null = null;
    let swipe: { x: number; y: number } | null = null;
    const dist = (t: TouchList) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    const start = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        pinch = { d: dist(e.touches), z: latest.current.zoom };
        swipe = null;
      } else if (e.touches.length === 1 && latest.current.zoom === 1) {
        swipe = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const move = (e: TouchEvent) => {
      if (pinch && e.touches.length === 2) {
        e.preventDefault();
        const mx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const my = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        const p = latest.current.pointAt(mx, my);
        latest.current.zoomAt(pinch.z * (dist(e.touches) / pinch.d), p.fx, p.fy, p.sx, p.sy);
      }
    };
    const end = (e: TouchEvent) => {
      if (e.touches.length < 2) pinch = null;
      if (swipe && e.changedTouches.length) {
        const dx = e.changedTouches[0].clientX - swipe.x;
        const dy = e.changedTouches[0].clientY - swipe.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) latest.current.go(dx < 0 ? 1 : -1);
        swipe = null;
      }
    };
    el.addEventListener("touchstart", start, { passive: true });
    el.addEventListener("touchmove", move, { passive: false });
    el.addEventListener("touchend", end);
    return () => {
      el.removeEventListener("touchstart", start);
      el.removeEventListener("touchmove", move);
      el.removeEventListener("touchend", end);
    };
  }, []);

  const btn = "grid size-11 place-items-center text-ivory transition-opacity hover:opacity-70 disabled:opacity-30";

  return (
    <div className="flex h-full flex-col">
      <div className="gutter flex h-14 shrink-0 items-center justify-between">
        <p className="eyebrow text-champagne tabular-nums" aria-live="polite">
          {index + 1} / {N} <span className="sr-only">— {LABEL[index]}</span>
          <span aria-hidden="true" className="ml-3 text-ivory/50">{LABEL[index]}</span>
        </p>
        <div className="-mr-3 flex items-center">
          <button type="button" className={btn} onClick={() => zoomAt(zoom - 0.75)} disabled={zoom <= 1} aria-label="Zoom out">
            <IconMinus />
          </button>
          <button type="button" className={btn} onClick={() => zoomAt(zoom + 0.75)} disabled={zoom >= MAX_ZOOM} aria-label="Zoom in">
            <IconPlus />
          </button>
          <button type="button" className={btn} onClick={onClose} aria-label="Close image viewer">
            <IconClose />
          </button>
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        <div
          ref={stage}
          className={clsx(
            "no-scrollbar absolute inset-0 overflow-auto overscroll-contain select-none",
            zoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in",
          )}
          style={{ touchAction: zoom > 1 ? "pan-x pan-y" : "pan-y" }}
          onPointerDown={(e) => {
            if (e.pointerType !== "mouse") {
              drag.current = { x: e.clientX, y: e.clientY, l: 0, t: 0, moved: false };
              return;
            }
            const el = stage.current!;
            drag.current = { x: e.clientX, y: e.clientY, l: el.scrollLeft, t: el.scrollTop, moved: false };
          }}
          onPointerMove={(e) => {
            const d = drag.current;
            if (!d) return;
            if (Math.abs(e.clientX - d.x) + Math.abs(e.clientY - d.y) > 6) d.moved = true;
            if (e.pointerType === "mouse" && zoom > 1 && e.buttons === 1) {
              stage.current!.scrollLeft = d.l - (e.clientX - d.x);
              stage.current!.scrollTop = d.t - (e.clientY - d.y);
            }
          }}
          onPointerUp={(e) => {
            const d = drag.current;
            drag.current = null;
            if (!d || d.moved) return;
            if (zoom > 1) zoomAt(1);
            else {
              const p = pointAt(e.clientX, e.clientY);
              zoomAt(TAP_ZOOM, p.fx, p.fy, p.sx, p.sy);
            }
          }}
          onPointerCancel={() => (drag.current = null)}
        >
          <div className="grid place-items-center" style={{ width: innerW || "100%", height: innerH || "100%" }}>
            {size.w > 0 && (
              <div className="relative" style={{ width: boxW, height: boxH }}>
                <ProductMedia
                  product={product}
                  finish={finish}
                  view={index}
                  tone="dark"
                  sizes="100vw"
                  className="absolute inset-0"
                />
              </div>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => go(-1)}
          className={clsx(btn, "absolute top-1/2 left-2 -translate-y-1/2 bg-obsidian/40 max-sm:hidden")}
          aria-label="Previous image"
        >
          <IconChevron dir="left" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          className={clsx(btn, "absolute top-1/2 right-2 -translate-y-1/2 bg-obsidian/40 max-sm:hidden")}
          aria-label="Next image"
        >
          <IconChevron dir="right" />
        </button>
      </div>

      <div className="safe-bottom flex shrink-0 justify-center gap-2 pt-3">
        {Array.from({ length: N }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setZoom(1);
              onIndex(i);
            }}
            aria-label={`Image ${i + 1}: ${LABEL[i]}`}
            aria-current={i === index ? "true" : undefined}
            className={clsx(
              "relative h-14 w-11 overflow-hidden ring-1 transition-opacity",
              i === index ? "ring-ivory" : "opacity-50 ring-transparent hover:opacity-80",
            )}
          >
            <ProductMedia product={product} finish={finish} view={i} sizes="44px" className="absolute inset-0" />
          </button>
        ))}
      </div>
      <p className="sr-only">Tap or click the image to zoom. Pinch to zoom on touch screens. Use the arrow keys to move between images.</p>
    </div>
  );
}
