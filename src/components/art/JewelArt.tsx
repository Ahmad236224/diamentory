/**
 * Original vector renderings of Diamentory product forms.
 *
 * These are art-directed placeholders shown until the brand's product
 * photography is supplied. They are deliberately stylised so they are never
 * mistaken for photographs of real stock.
 */
import { useId } from "react";
import type { ArtForm, Finish } from "@/lib/catalog/types";

type Tone = "ivory" | "stone" | "dark";
type Pt = { x: number; y: number; a: number };

const W = 1000;
const H = 1250;

const METAL: Record<Exclude<Finish, "two-tone">, string[]> = {
  gold: ["#6f5326", "#c9a463", "#f4e4b8", "#b08442", "#e8cf92", "#7a5b2a"],
  silver: ["#5c5f62", "#b9bcbf", "#ffffff", "#8d9093", "#e6e8ea", "#55585b"],
  black: ["#050505", "#3b3936", "#77736d", "#1c1b1a", "#4d4a46", "#0a0a0a"],
};

const BG: Record<Tone, { base: string; glow: string; shadow: string }> = {
  ivory: { base: "#ececeb", glow: "#fafafa", shadow: "#6f6f6f" },
  stone: { base: "#d9d9d7", glow: "#ececeb", shadow: "#5a5a5a" },
  dark: { base: "#0c0c0c", glow: "#262626", shadow: "#000000" },
};

/* ── geometry helpers ── */
function quad(ax: number, ay: number, cx: number, cy: number, bx: number, by: number, n: number): Pt[] {
  // arc-length-even sampling of a quadratic bezier
  const dense: { x: number; y: number; d: number }[] = [];
  let px = ax,
    py = ay,
    d = 0;
  for (let i = 0; i <= 400; i++) {
    const t = i / 400;
    const x = (1 - t) ** 2 * ax + 2 * (1 - t) * t * cx + t * t * bx;
    const y = (1 - t) ** 2 * ay + 2 * (1 - t) * t * cy + t * t * by;
    d += Math.hypot(x - px, y - py);
    dense.push({ x, y, d });
    px = x;
    py = y;
  }
  const total = d;
  const out: Pt[] = [];
  let j = 0;
  for (let i = 0; i < n; i++) {
    const target = (i / (n - 1)) * total;
    while (j < dense.length - 1 && dense[j].d < target) j++;
    const p = dense[j];
    const q = dense[Math.min(j + 1, dense.length - 1)];
    const r = dense[Math.max(j - 1, 0)];
    out.push({ x: p.x, y: p.y, a: (Math.atan2(q.y - r.y, q.x - r.x) * 180) / Math.PI });
  }
  return out;
}

function ellipsePts(cx: number, cy: number, rx: number, ry: number, n: number): (Pt & { z: number })[] {
  return Array.from({ length: n }, (_, i) => {
    const t = (i / n) * Math.PI * 2;
    const x = cx + rx * Math.cos(t);
    const y = cy + ry * Math.sin(t);
    const a = (Math.atan2(ry * Math.cos(t), -rx * Math.sin(t)) * 180) / Math.PI;
    return { x, y, a, z: Math.sin(t) };
  }).sort((p, q) => p.z - q.z);
}

/** Closed ellipse as a path, for even-odd cut-outs. */
const ell = (cx: number, cy: number, rx: number, ry: number) =>
  `M${cx - rx} ${cy} A${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A${rx} ${ry} 0 1 0 ${cx - rx} ${cy}Z`;

const r = (n: number) => Math.round(n * 10) / 10;

/* ── gradients ── */
function MetalDefs({ id, finish }: { id: string; finish: Finish }) {
  const sets = finish === "two-tone" ? (["gold", "silver"] as const) : ([finish, finish] as const);
  return (
    <>
      {sets.map((m, k) => {
        const c = METAL[m];
        return (
          <linearGradient key={k} id={`${id}-m${k}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={c[0]} />
            <stop offset="0.28" stopColor={c[1]} />
            <stop offset="0.45" stopColor={c[2]} />
            <stop offset="0.62" stopColor={c[3]} />
            <stop offset="0.8" stopColor={c[4]} />
            <stop offset="1" stopColor={c[5]} />
          </linearGradient>
        );
      })}
      {sets.map((m, k) => {
        const c = METAL[m];
        return (
          <linearGradient key={`h${k}`} id={`${id}-h${k}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={c[5]} />
            <stop offset="0.18" stopColor={c[1]} />
            <stop offset="0.34" stopColor={c[2]} />
            <stop offset="0.5" stopColor={c[3]} />
            <stop offset="0.7" stopColor={c[4]} />
            <stop offset="0.86" stopColor={c[1]} />
            <stop offset="1" stopColor={c[0]} />
          </linearGradient>
        );
      })}
      <radialGradient id={`${id}-stone`} cx="0.38" cy="0.32" r="0.75">
        <stop offset="0" stopColor={finish === "black" ? "#5d5a56" : "#ffffff"} />
        <stop offset="0.45" stopColor={finish === "black" ? "#1d1c1b" : "#dfe5ea"} />
        <stop offset="1" stopColor={finish === "black" ? "#050505" : "#8f9aa3"} />
      </radialGradient>
    </>
  );
}

/* ── forms ── */
type FormProps = { id: string; finish: Finish };
const m = (id: string, k: number) => `url(#${id}-m${k})`;
const h = (id: string, k: number) => `url(#${id}-h${k})`;
const alt = (finish: Finish, i: number) => (finish === "two-tone" ? i % 2 : 0);

function CubanLinks({ id, finish, pts, w }: FormProps & { pts: Pt[]; w: number }) {
  const step = pts.length > 1 ? Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y) : w;
  return (
    <g>
      {pts.map((p, i) => (
        <g key={i} transform={`translate(${r(p.x)} ${r(p.y)}) rotate(${r(p.a + (i % 2 ? 9 : -9))})`}>
          <ellipse rx={r(step * 0.92)} ry={r(w * 0.5)} fill="none" stroke="#000" strokeOpacity="0.35" strokeWidth={r(w * 0.34)} />
          <ellipse rx={r(step * 0.92)} ry={r(w * 0.5)} fill="none" stroke={m(id, alt(finish, i))} strokeWidth={r(w * 0.27)} />
          <ellipse rx={r(step * 0.6)} ry={r(w * 0.17)} fill="none" stroke="#fff" strokeOpacity="0.22" strokeWidth={r(w * 0.04)} />
        </g>
      ))}
    </g>
  );
}

function RopeLinks({ id, finish, pts, w }: FormProps & { pts: Pt[]; w: number }) {
  return (
    <g>
      {pts.map((p, i) => (
        <rect
          key={i}
          x={r(-w * 0.75)}
          y={r(-w * 0.2)}
          width={r(w * 1.5)}
          height={r(w * 0.4)}
          rx={r(w * 0.2)}
          fill={m(id, alt(finish, Math.floor(i / 3)))}
          stroke="#000"
          strokeOpacity="0.25"
          strokeWidth="1.5"
          transform={`translate(${r(p.x)} ${r(p.y)}) rotate(${r(p.a + 48)})`}
        />
      ))}
    </g>
  );
}

function TennisLinks({ id, finish, pts, w }: FormProps & { pts: Pt[]; w: number }) {
  return (
    <g>
      {pts.map((p, i) => (
        <g key={i} transform={`translate(${r(p.x)} ${r(p.y)}) rotate(${r(p.a)})`}>
          <rect x={r(-w * 0.55)} y={r(-w * 0.55)} width={r(w * 1.1)} height={r(w * 1.1)} rx={r(w * 0.22)} fill={m(id, alt(finish, i))} stroke="#000" strokeOpacity="0.3" strokeWidth="1.5" />
          <circle r={r(w * 0.4)} fill={`url(#${id}-stone)`} />
          <path
            d={`M0 ${r(-w * 0.4)} L${r(w * 0.12)} 0 L0 ${r(w * 0.4)} L${r(-w * 0.12)} 0Z M${r(-w * 0.4)} 0 L0 ${r(w * 0.12)} L${r(w * 0.4)} 0 L0 ${r(-w * 0.12)}Z`}
            fill="#fff"
            fillOpacity={finish === "black" ? 0.12 : 0.45}
          />
        </g>
      ))}
    </g>
  );
}

function BoxLinks({ id, finish, pts, w }: FormProps & { pts: Pt[]; w: number }) {
  return (
    <g>
      {pts.map((p, i) => (
        <g key={i} transform={`translate(${r(p.x)} ${r(p.y)}) rotate(${r(p.a)})`}>
          <rect x={r(-w / 2)} y={r(-w / 2)} width={r(w)} height={r(w)} fill={m(id, alt(finish, i))} stroke="#000" strokeOpacity="0.45" strokeWidth="1.5" />
          <rect x={r(-w * 0.22)} y={r(-w * 0.22)} width={r(w * 0.44)} height={r(w * 0.44)} fill="#000" fillOpacity="0.45" />
        </g>
      ))}
    </g>
  );
}

function Necklace({ id, finish, kind }: FormProps & { kind: "cuban" | "rope" | "tennis" | "box" }) {
  const cfg = {
    cuban: { n: 34, w: 52 },
    rope: { n: 120, w: 30 },
    tennis: { n: 44, w: 36 },
    box: { n: 60, w: 22 },
  }[kind];
  const left = quad(150, 120, 230, 820, 500, 1010, Math.ceil(cfg.n / 2));
  const right = quad(500, 1010, 770, 820, 850, 120, Math.ceil(cfg.n / 2)).slice(1);
  const pts = [...left, ...right];
  const Links = { cuban: CubanLinks, rope: RopeLinks, tennis: TennisLinks, box: BoxLinks }[kind];
  return (
    <g>
      <Links id={id} finish={finish} pts={pts} w={cfg.w} />
      {/* clasp */}
      <rect x="826" y="78" width="46" height="70" rx="8" fill={m(id, 0)} stroke="#000" strokeOpacity="0.3" transform="rotate(-8 849 113)" />
    </g>
  );
}

function Bracelet({ id, finish, kind }: FormProps & { kind: "cuban" | "tennis" }) {
  const pts = ellipsePts(500, 640, 300, 175, kind === "cuban" ? 30 : 42);
  return (
    <g>
      {pts.map((p, i) => {
        const shade = 0.45 + 0.55 * ((p.z + 1) / 2);
        return (
          <g key={i} opacity={r(shade)}>
            {kind === "cuban" ? (
              <CubanLinks id={id} finish={finish} pts={[p]} w={58} />
            ) : (
              <TennisLinks id={id} finish={finish} pts={[p]} w={40} />
            )}
          </g>
        );
      })}
    </g>
  );
}

function Cylinder({ id, cx, cy, rx, ry, hgt, k = 0, open = false }: { id: string; cx: number; cy: number; rx: number; ry: number; hgt: number; k?: number; open?: boolean }) {
  const front = `M${cx - rx} ${cy} A${rx} ${ry} 0 0 0 ${cx + rx} ${cy} L${cx + rx} ${cy + hgt} A${rx} ${ry} 0 0 1 ${cx - rx} ${cy + hgt}Z`;
  const back = `M${cx - rx} ${cy} A${rx} ${ry} 0 0 1 ${cx + rx} ${cy} L${cx + rx} ${cy + hgt} A${rx} ${ry} 0 0 0 ${cx - rx} ${cy + hgt}Z`;
  return (
    <g>
      <path d={back} fill={m(id, k)} />
      <path d={back} fill="#000" fillOpacity="0.45" />
      <path d={front} fill={h(id, k)} />
      <path d={`M${cx - rx} ${cy + hgt * 0.5} A${rx} ${ry} 0 0 0 ${cx + rx} ${cy + hgt * 0.5}`} fill="none" stroke="#fff" strokeOpacity="0.18" strokeWidth={r(hgt * 0.08)} />
      <path d={`M${cx - rx} ${cy} A${rx} ${ry} 0 0 0 ${cx + rx} ${cy}`} fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="4" />
      {open && <rect x={cx - 26} y={cy + ry - 6} width="52" height={hgt + 14} fill="currentColor" />}
    </g>
  );
}

function Ring({ id, finish, top }: FormProps & { top?: "signet" | "stone" }) {
  const k0 = 0;
  const k1 = finish === "two-tone" ? 1 : 0;
  return (
    <g>
      <path d={`${ell(500, 700, 250, 262)} ${ell(500, 694, 186, 192)}`} fillRule="evenodd" fill={m(id, k0)} />
      <path d={`${ell(500, 712, 190, 200)} ${ell(500, 694, 186, 192)}`} fillRule="evenodd" fill={h(id, k1)} />
      <path d={`${ell(500, 712, 190, 200)} ${ell(500, 694, 186, 192)}`} fillRule="evenodd" fill="#000" fillOpacity="0.42" />
      <ellipse cx="500" cy="700" rx="250" ry="262" fill="none" stroke="#000" strokeOpacity="0.28" strokeWidth="3" />
      <path d="M300 560 A250 262 0 0 1 560 440" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="9" strokeLinecap="round" />
      {top === "signet" && (
        <g>
          <ellipse cx="500" cy="452" rx="175" ry="92" fill="#000" fillOpacity="0.35" />
          <ellipse cx="500" cy="440" rx="172" ry="88" fill={m(id, k1)} />
          <ellipse cx="500" cy="436" rx="140" ry="66" fill={h(id, k1)} />
          <ellipse cx="500" cy="436" rx="140" ry="66" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="3" />
        </g>
      )}
      {top === "stone" && (
        <g transform="translate(500 430)">
          <rect x="-118" y="-118" width="236" height="236" rx="20" transform="rotate(45) scale(1 .62)" fill={m(id, k1)} stroke="#000" strokeOpacity="0.3" strokeWidth="3" />
          <rect x="-88" y="-88" width="176" height="176" rx="6" transform="rotate(45) scale(1 .62)" fill={`url(#${id}-stone)`} />
          <path d="M-124 0 L0 -77 L124 0 L0 77Z M-62 0 L0 -38 L62 0 L0 38Z" fill="none" stroke="#fff" strokeOpacity={finish === "black" ? 0.2 : 0.6} strokeWidth="2.5" />
        </g>
      )}
    </g>
  );
}

function FineChain({ id, sag = 760 }: { id: string; sag?: number }) {
  return (
    <g fill="none" strokeLinecap="round">
      <path d={`M180 60 Q260 ${sag - 140} 500 ${sag - 70}`} stroke="#000" strokeOpacity="0.3" strokeWidth="13" />
      <path d={`M820 60 Q740 ${sag - 140} 500 ${sag - 70}`} stroke="#000" strokeOpacity="0.3" strokeWidth="13" />
      <path d={`M180 60 Q260 ${sag - 140} 500 ${sag - 70}`} stroke={m(id, 0)} strokeWidth="9" strokeDasharray="10 5" />
      <path d={`M820 60 Q740 ${sag - 140} 500 ${sag - 70}`} stroke={m(id, 0)} strokeWidth="9" strokeDasharray="10 5" />
    </g>
  );
}

function Pendant({ id, finish, shape }: FormProps & { shape: "cross" | "disc" | "bar" }) {
  const k = finish === "two-tone" ? 1 : 0;
  return (
    <g>
      {shape !== "bar" && <FineChain id={id} />}
      {shape === "bar" && (
        <path d="M500 90 L500 380" stroke={m(id, 0)} strokeWidth="9" strokeDasharray="10 5" fill="none" />
      )}
      <ellipse cx="500" cy={shape === "bar" ? 410 : 712} rx="26" ry="32" fill="none" stroke={m(id, k)} strokeWidth="12" />
      {shape === "cross" && (
        <g transform="translate(500 752)">
          <path d="M-34 0 H34 V120 H134 V188 H34 V430 H-34 V188 H-134 V120 H-34Z" fill="#000" fillOpacity="0.3" transform="translate(10 14)" />
          <path d="M-34 0 H34 V120 H134 V188 H34 V430 H-34 V188 H-134 V120 H-34Z" fill={m(id, k)} />
          <path d="M-16 18 H16 V138 H116 V170 H16 V412 H-16 V170 H-116 V138 H-16Z" fill={h(id, k)} opacity="0.85" />
        </g>
      )}
      {shape === "disc" && (
        <g transform="translate(500 920)">
          <circle r="190" fill="#000" fillOpacity="0.3" cx="10" cy="14" />
          <circle r="190" fill={m(id, k)} />
          <circle r="158" fill={h(id, k)} />
          {Array.from({ length: 22 }, (_, i) => (
            <line key={i} x1="-150" x2="150" y1={-140 + i * 13} y2={-140 + i * 13} stroke="#fff" strokeOpacity="0.07" strokeWidth="3" />
          ))}
          <circle r="190" fill="none" stroke="#fff" strokeOpacity="0.4" strokeWidth="4" />
        </g>
      )}
      {shape === "bar" && (
        <g transform="translate(500 440)">
          <rect x="-50" y="0" width="100" height="560" rx="6" fill="#000" fillOpacity="0.3" transform="translate(12 14)" />
          <rect x="-50" y="0" width="100" height="560" rx="6" fill={h(id, k)} />
          <rect x="-50" y="0" width="100" height="560" rx="6" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="3" />
        </g>
      )}
    </g>
  );
}

function Form({ id, finish, form }: FormProps & { form: ArtForm }) {
  switch (form) {
    case "cuban-chain":
      return <Necklace id={id} finish={finish} kind="cuban" />;
    case "rope-chain":
      return <Necklace id={id} finish={finish} kind="rope" />;
    case "tennis-chain":
      return <Necklace id={id} finish={finish} kind="tennis" />;
    case "box-chain":
      return <Necklace id={id} finish={finish} kind="box" />;
    case "cuban-bracelet":
      return <Bracelet id={id} finish={finish} kind="cuban" />;
    case "tennis-bracelet":
      return <Bracelet id={id} finish={finish} kind="tennis" />;
    case "cuff":
      return (
        <g>
          <Cylinder id={id} cx={500} cy={540} rx={300} ry={150} hgt={190} />
          {finish === "two-tone" && <Cylinder id={id} cx={500} cy={600} rx={300} ry={150} hgt={60} k={1} />}
        </g>
      );
    case "bangle":
      return (
        <g>
          <Cylinder id={id} cx={500} cy={560} rx={300} ry={190} hgt={70} />
        </g>
      );
    case "band-ring":
      return <Ring id={id} finish={finish} />;
    case "signet-ring":
      return <Ring id={id} finish={finish} top="signet" />;
    case "stone-ring":
      return <Ring id={id} finish={finish} top="stone" />;
    case "pendant-cross":
      return <Pendant id={id} finish={finish} shape="cross" />;
    case "pendant-disc":
      return <Pendant id={id} finish={finish} shape="disc" />;
    case "pendant-bar":
      return <Pendant id={id} finish={finish} shape="bar" />;
    case "set":
      return (
        <g>
          <g transform="translate(0 -120) scale(1 .85)">
            <Necklace id={id} finish={finish} kind="cuban" />
          </g>
          <g transform="translate(250 690) scale(.5)">
            <Bracelet id={id} finish={finish === "two-tone" ? "two-tone" : finish} kind="cuban" />
          </g>
        </g>
      );
  }
}

/** Gallery views: 0 full · 1 detail crop · 2 angled · 3 on dark. */
const VIEWS: { crop: [number, number, number, number]; rotate: number }[] = [
  { crop: [0, 0, W, H], rotate: 0 },
  { crop: [180, 420, 640, 800], rotate: 0 },
  { crop: [-60, 0, 1120, 1400], rotate: -14 },
  { crop: [40, 60, 920, 1150], rotate: 6 },
];

export interface JewelArtProps {
  form: ArtForm;
  finish: Finish;
  tone?: Tone;
  view?: number;
  /** Override the viewBox for art-directed crops: [x, y, width, height]. */
  crop?: [number, number, number, number];
  rotate?: number;
  title?: string;
  className?: string;
}

export function JewelArt({ form, finish, tone, view = 0, crop, rotate, title, className }: JewelArtProps) {
  const v = VIEWS[view % VIEWS.length];
  const t: Tone = tone ?? (view === 3 ? "dark" : "ivory");
  const bg = BG[t];
  // unique per instance: duplicate ids break gradients when the first copy is display:none
  const id = `ja${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [x, y, w, hh] = crop ?? v.crop;
  const rot = rotate ?? v.rotate;
  return (
    <svg
      viewBox={`${x} ${y} ${w} ${hh}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      style={{ color: bg.base, display: "block", width: "100%", height: "100%" }}
    >
      <defs>
        <MetalDefs id={id} finish={finish} />
        <radialGradient id={`${id}-bg`} cx="0.5" cy="0.42" r="0.75">
          <stop offset="0" stopColor={bg.glow} />
          <stop offset="1" stopColor={bg.base} />
        </radialGradient>
        <radialGradient id={`${id}-sh`}>
          <stop offset="0" stopColor={bg.shadow} stopOpacity={t === "dark" ? 0.9 : 0.35} />
          <stop offset="1" stopColor={bg.shadow} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x={-600} y={-600} width={W + 1200} height={H + 1200} fill={`url(#${id}-bg)`} />
      <ellipse cx="500" cy="1060" rx="420" ry="70" fill={`url(#${id}-sh)`} />
      <g transform={`rotate(${rot} 500 625)`}>
        <Form id={id} finish={finish} form={form} />
      </g>
    </svg>
  );
}
