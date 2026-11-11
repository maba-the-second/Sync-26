// Component created by Dominik Koch
// https://x.com/dominikkoch

import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import './OrbitImages.css';

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const SAMPLES = 720;
const FRONT_GROW = 0.3;
const BACK_SHRINK = 0.45;
const BACK_DIM = 0.55;
const INTRO_SPREAD = 1.3;
const INTRO_FADE = 0.45;
const DRAG_THRESHOLD = 5;

export type OrbitShape =
  | 'ellipse'
  | 'circle'
  | 'square'
  | 'rectangle'
  | 'triangle'
  | 'star'
  | 'heart'
  | 'infinity'
  | 'wave'
  | 'custom';

export type OrbitEasing = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';

export interface OrbitCardItem {
  id?: string;
  src?: string;
  alt?: string;
  code?: string;
  eligibility?: string;
  title?: string;
  description?: string;
  accentColor?: string;
  accentRgb?: string;
}

export interface OrbitImagesProps {
  images?: Array<string | OrbitCardItem>;
  altPrefix?: string;
  shape?: OrbitShape;
  customPath?: string;
  baseWidth?: number;
  radiusX?: number;
  radiusY?: number;
  radius?: number;
  starPoints?: number;
  starInnerRatio?: number;
  rotation?: number;
  duration?: number;
  itemSize?: number;
  itemWidth?: number;
  itemHeight?: number;
  direction?: 'normal' | 'reverse';
  fill?: boolean;
  width?: number | string;
  height?: number | string;
  className?: string;
  showPath?: boolean;
  pathColor?: string;
  pathWidth?: number;
  pathDash?: number;
  easing?: OrbitEasing;
  paused?: boolean;
  depth?: number;
  itemRadius?: number | string;
  shadow?: number;
  hoverScale?: number;
  hoverSpeed?: number;
  draggable?: boolean;
  clickToFront?: boolean;
  onItemClick?: (index: number, src: string, rect?: DOMRect) => void;
  onViewDetails?: (index: number) => void;
  onRegister?: (index: number) => void;
  alignToPath?: boolean;
  intro?: boolean;
  speedMultiplier?: number;
  centerContent?: ReactNode;
}

interface EngineConfig {
  baseWidth: number;
  rotation: number;
  duration: number;
  itemSize: number;
  itemWidth: number;
  itemHeight: number;
  direction: 'normal' | 'reverse';
  fill: boolean;
  pathWidth: number;
  pathDash: number;
  easing: OrbitEasing;
  paused: boolean;
  depth: number;
  hoverScale: number;
  hoverSpeed: number;
  draggable: boolean;
  clickToFront: boolean;
  onItemClick?: (index: number, src: string, rect?: DOMRect) => void;
  onViewDetails?: (index: number) => void;
  onRegister?: (index: number) => void;
  alignToPath: boolean;
  intro: boolean;
  speedMultiplier: number;
  sources: string[];
}

function generateEllipsePath(cx: number, cy: number, rx: number, ry: number) {
  return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`;
}

function generateCirclePath(cx: number, cy: number, r: number) {
  return generateEllipsePath(cx, cy, r, r);
}

function generateSquarePath(cx: number, cy: number, size: number) {
  const h = size / 2;
  return `M ${cx - h} ${cy - h} L ${cx + h} ${cy - h} L ${cx + h} ${cy + h} L ${cx - h} ${cy + h} Z`;
}

function generateRectanglePath(cx: number, cy: number, w: number, h: number) {
  const hw = w / 2;
  const hh = h / 2;
  return `M ${cx - hw} ${cy - hh} L ${cx + hw} ${cy - hh} L ${cx + hw} ${cy + hh} L ${cx - hw} ${cy + hh} Z`;
}

function generateTrianglePath(cx: number, cy: number, size: number) {
  const height = (size * Math.sqrt(3)) / 2;
  const hs = size / 2;
  return `M ${cx} ${cy - height / 1.5} L ${cx + hs} ${cy + height / 3} L ${cx - hs} ${cy + height / 3} Z`;
}

function generateStarPath(cx: number, cy: number, outerR: number, innerR: number, points: number) {
  const step = Math.PI / points;
  let path = '';
  for (let i = 0; i < 2 * points; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = i * step - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }
  return path + ' Z';
}

function generateHeartPath(cx: number, cy: number, size: number) {
  const s = size / 30;
  return `M ${cx} ${cy + 12 * s} C ${cx - 20 * s} ${cy - 5 * s}, ${cx - 12 * s} ${cy - 18 * s}, ${cx} ${cy - 8 * s} C ${cx + 12 * s} ${cy - 18 * s}, ${cx + 20 * s} ${cy - 5 * s}, ${cx} ${cy + 12 * s}`;
}

function generateInfinityPath(cx: number, cy: number, w: number, h: number) {
  const hw = w / 2;
  const hh = h / 2;
  return `M ${cx} ${cy} C ${cx + hw * 0.5} ${cy - hh}, ${cx + hw} ${cy - hh}, ${cx + hw} ${cy} C ${cx + hw} ${cy + hh}, ${cx + hw * 0.5} ${cy + hh}, ${cx} ${cy} C ${cx - hw * 0.5} ${cy + hh}, ${cx - hw} ${cy + hh}, ${cx - hw} ${cy} C ${cx - hw} ${cy - hh}, ${cx - hw * 0.5} ${cy - hh}, ${cx} ${cy}`;
}

function generateWavePath(cx: number, cy: number, w: number, amplitude: number, waves: number) {
  const pts: string[] = [];
  const segs = waves * 20;
  const hw = w / 2;
  for (let i = 0; i <= segs; i++) {
    const x = cx - hw + (w * i) / segs;
    const y = cy + Math.sin((i / segs) * waves * 2 * Math.PI) * amplitude;
    pts.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
  }
  for (let i = segs; i >= 0; i--) {
    const x = cx - hw + (w * i) / segs;
    const y = cy - Math.sin((i / segs) * waves * 2 * Math.PI) * amplitude;
    pts.push(`L ${x} ${y}`);
  }
  return pts.join(' ') + ' Z';
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const toCssLength = (value: number | string) => (typeof value === 'number' ? `${value}px` : value);

const wrapSigned = (value: number) => value - Math.round(value);

const cubicBezier = (x1: number, y1: number, x2: number, y2: number) => {
  const sample = (a1: number, a2: number, t: number) =>
    ((1 - 3 * a2 + 3 * a1) * t + (3 * a2 - 6 * a1)) * t * t + 3 * a1 * t;
  const slope = (a1: number, a2: number, t: number) =>
    3 * (1 - 3 * a2 + 3 * a1) * t * t + 2 * (3 * a2 - 6 * a1) * t + 3 * a1;
  return (x: number) => {
    if (x <= 0 || x >= 1) return x;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const s = slope(x1, x2, t);
      if (Math.abs(s) < 1e-6) break;
      t = clamp(t - (sample(x1, x2, t) - x) / s, 0, 1);
    }
    return sample(y1, y2, t);
  };
};

const EASINGS: Record<OrbitEasing, (t: number) => number> = {
  linear: (t) => t,
  easeIn: cubicBezier(0.42, 0, 1, 1),
  easeOut: cubicBezier(0, 0, 0.58, 1),
  easeInOut: cubicBezier(0.42, 0, 0.58, 1),
};

const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

const estimateAspect = ({
  shape,
  radiusX,
  radiusY,
  radius,
  itemSize,
}: {
  shape: OrbitShape;
  radiusX: number;
  radiusY: number;
  radius: number;
  itemSize: number;
}) => {
  const wide = shape === 'ellipse' || shape === 'rectangle' || shape === 'infinity' || shape === 'wave';
  const w = (wide ? radiusX : radius) * 2 + itemSize * 1.6;
  const h = (wide ? radiusY : radius) * 2 + itemSize * 1.6;
  return w > 0 && h > 0 ? w / h : 1;
};

interface OrbitItemRecord {
  el: HTMLElement;
  t: string;
  o: string;
  z: string;
}

interface DragState {
  id: number;
  x: number;
  y: number;
  active: boolean;
  samples: [number, number][];
  rate: number;
  anchor: number;
  manual: number;
}

interface SeekState {
  from: number;
  delta: number;
  t: number;
  dur: number;
  targetIndex?: number;
  notify?: boolean;
}

/** Computes an opaque solid background and WCAG high-contrast ink tokens per card accent. */
function getSolidCardVars(accentColor: string, accentRgb: string): CSSProperties {
  const parts = accentRgb.split(',').map((n) => Number.parseFloat(n.trim()));
  let isLight = false;
  if (parts.length === 3 && parts.every((n) => !Number.isNaN(n))) {
    const [r, g, b] = parts.map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    isLight = luminance > 0.2;
  }
  return {
    '--card-accent': accentColor,
    '--card-rgb': accentRgb,
    '--card-bg': accentColor,
    '--card-fg': isLight ? '#050709' : '#ffffff',
    '--card-fg-muted': isLight ? 'rgba(5, 7, 9, 0.88)' : 'rgba(255, 255, 255, 0.92)',
    '--card-divider': isLight ? 'rgba(5, 7, 9, 0.28)' : 'rgba(255, 255, 255, 0.35)',
    '--card-btn-bg': isLight ? '#050709' : '#ffffff',
    '--card-btn-fg': isLight ? '#ffffff' : '#050709',
  } as CSSProperties;
}

const createEngine = (
  root: HTMLElement,
  config: React.MutableRefObject<EngineConfig>,
  setAspect: (val: number) => void
) => {
  const query =
    typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;

  const st = {
    lut: null as Float32Array | null,
    length: 0,
    front: 0,
    yMid: 0,
    yHalf: 1,
    rawXMax: 1,
    rawYMax: 1,
    bbox: [0, 0, 1, 1] as [number, number, number, number],
    width: 0,
    height: 0,
    scale: 0,
    size: 0,
    itemW: 0,
    itemH: 0,
    items: [] as OrbitItemRecord[],
    strokes: [] as SVGPathElement[],
    lap: 0,
    manual: 0,
    glide: 0,
    speed: 1,
    drag: null as DragState | null,
    seek: null as SeekState | null,
    hovered: false,
    hoverIndex: -1,
    suppressUntil: 0,
    introStart: -1,
    introDone: !config.current.intro,
    visible: true,
    reduced: false,
    raf: 0,
    last: 0,
    destroyed: false,
  };
  st.speed = config.current.paused ? 0 : 1;

  const collect = () => {
    st.items = Array.from(root.querySelectorAll<HTMLElement>('[data-orbit-item]')).map((el) => ({
      el,
      t: '',
      o: '',
      z: '',
    }));
    st.strokes = Array.from(root.querySelectorAll<SVGPathElement>('[data-orbit-stroke]'));
  };

  const build = () => {
    const cfg = config.current;
    const path = root.querySelector<SVGPathElement>('[data-orbit-path]');
    let length = 0;
    try {
      length = path ? path.getTotalLength() : 0;
    } catch {
      length = 0;
    }
    if (!path || !length || !isFinite(length)) {
      st.lut = null;
      return;
    }
    const lut = new Float32Array(SAMPLES * 4);
    const angle = (cfg.rotation * Math.PI) / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const origin = cfg.baseWidth / 2;
    let x0 = Infinity;
    let x1 = -Infinity;
    let y0 = Infinity;
    let y1 = -Infinity;
    let rawXMax = 1e-3;
    let rawYMax = 1e-3;
    let front = 0;
    for (let i = 0; i < SAMPLES; i++) {
      const point = path.getPointAtLength((i / SAMPLES) * length);
      const dx = point.x - origin;
      const dy = point.y - origin;
      const x = origin + dx * cos - dy * sin;
      const y = origin + dx * sin + dy * cos;
      lut[i * 4] = x;
      lut[i * 4 + 1] = y;
      lut[i * 4 + 2] = dx;
      lut[i * 4 + 3] = dy;
      x0 = Math.min(x0, x);
      x1 = Math.max(x1, x);
      y0 = Math.min(y0, y);
      y1 = Math.max(y1, y);
      rawXMax = Math.max(rawXMax, Math.abs(dx));
      rawYMax = Math.max(rawYMax, Math.abs(dy));
      if (dy > lut[front * 4 + 3] + 1e-6) front = i;
    }
    st.lut = lut;
    st.length = length;
    st.front = front / SAMPLES;
    st.yMid = (y0 + y1) / 2;
    st.yHalf = Math.max(1e-3, (y1 - y0) / 2);
    st.rawXMax = rawXMax;
    st.rawYMax = rawYMax;
    const depth = clamp(cfg.depth, 0, 1);
    const maxItemDim = Math.max(cfg.itemSize, cfg.itemWidth, cfg.itemHeight);
    const margin = (maxItemDim / 2) * (1 + depth * FRONT_GROW) * Math.max(1, cfg.hoverScale) + 2;
    st.bbox = [x0 - margin, y0 - margin, x1 + margin, y1 + margin];
    setAspect((x1 - x0 + margin * 2) / (y1 - y0 + margin * 2));
  };

  const applyDash = (reveal: number) => {
    const cfg = config.current;
    const dash = cfg.pathDash > 0 && st.scale ? cfg.pathDash / st.scale : 0;
    for (const stroke of st.strokes) {
      if (reveal < 1 && !dash) {
        stroke.style.strokeDasharray = `${st.length} ${st.length}`;
        stroke.style.strokeDashoffset = String(st.length * (1 - reveal));
        stroke.style.opacity = '';
      } else {
        stroke.style.strokeDasharray = dash ? `${dash} ${dash * 1.6}` : '';
        stroke.style.strokeDashoffset = '';
        stroke.style.opacity = reveal < 1 ? String(reveal) : '';
      }
    }
  };

  const layout = () => {
    const cfg = config.current;
    st.width = root.clientWidth;
    st.height = root.clientHeight;
    if (!st.lut) return;
    const [bx0, by0, bx1, by1] = st.bbox;
    const scale = Math.min(st.width / (bx1 - bx0), st.height / (by1 - by0));
    st.scale = scale > 0 && isFinite(scale) ? scale : 0;
    st.size = cfg.itemSize * st.scale;
    st.itemW = cfg.itemWidth * st.scale;
    st.itemH = cfg.itemHeight * st.scale;
    for (const it of st.items) {
      it.el.style.width = `${st.itemW}px`;
      it.el.style.height = `${st.itemH}px`;
    }
    if (!st.scale) return;
    const vw = st.width / st.scale;
    const vh = st.height / st.scale;
    const cx = (bx0 + bx1) / 2;
    const cy = (by0 + by1) / 2;
    root.querySelectorAll('[data-orbit-svg]').forEach((svg) => {
      svg.setAttribute('viewBox', `${cx - vw / 2} ${cy - vh / 2} ${vw} ${vh}`);
    });
    const clip = root.querySelector('[data-orbit-clip]');
    if (clip) {
      clip.setAttribute('x', String(cx - vw));
      clip.setAttribute('y', String(st.yMid));
      clip.setAttribute('width', String(vw * 2));
      clip.setAttribute('height', String(vh * 2));
    }
    for (const stroke of st.strokes) {
      stroke.style.strokeWidth = String(cfg.pathWidth / st.scale);
    }
    applyDash(1);
  };

  const sample = (u: number): [number, number, number, number] => {
    const f = (((u % 1) + 1) % 1) * SAMPLES;
    const i0 = Math.floor(f) % SAMPLES;
    const i1 = (i0 + 1) % SAMPLES;
    const t = f - Math.floor(f);
    const lut = st.lut!;
    const idx0 = i0 * 4;
    const idx1 = i1 * 4;
    return [
      lut[idx0] + (lut[idx1] - lut[idx0]) * t,
      lut[idx0 + 1] + (lut[idx1 + 1] - lut[idx0 + 1]) * t,
      lut[idx0 + 2] + (lut[idx1 + 2] - lut[idx0 + 2]) * t,
      lut[idx0 + 3] + (lut[idx1 + 3] - lut[idx0 + 3]) * t,
    ];
  };

  const heading = (u: number) => {
    const a = sample(u - 2 / SAMPLES);
    const b = sample(u + 2 / SAMPLES);
    return (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
  };

  const progress = () => {
    const cfg = config.current;
    const ease = EASINGS[cfg.easing] || EASINGS.linear;
    const whole = Math.floor(st.lap);
    return (whole + ease(st.lap - whole)) * (cfg.direction === 'reverse' ? -1 : 1) + st.manual;
  };

  const offsetOf = (index: number, count: number) => {
    const cfg = config.current;
    if (cfg.fill) return index / Math.max(1, count);
    return (-index * cfg.itemSize * 1.3) / Math.max(1, st.length);
  };

  const write = (
    it: OrbitItemRecord,
    key: 't' | 'o' | 'z',
    prop: 'transform' | 'opacity' | 'zIndex',
    value: string
  ) => {
    if (it[key] !== value) {
      it[key] = value;
      it.el.style[prop] = value;
    }
  };

  const render = (now: number) => {
    const cfg = config.current;
    if (!st.lut || !st.scale) return;
    const p = progress();
    const count = st.items.length;
    const depth = clamp(cfg.depth, 0, 1);
    const [bx0, by0, bx1, by1] = st.bbox;
    const cx = (bx0 + bx1) / 2;
    const cy = (by0 + by1) / 2;
    const halfW = st.itemW / 2;
    const halfH = st.itemH / 2;
    const introRunning = st.introStart >= 0;
    const elapsed = introRunning ? (now - st.introStart) / 1000 : 0;
    const spread = introRunning ? easeOutQuint(clamp(elapsed / INTRO_SPREAD, 0, 1)) : 1;
    const appear = introRunning ? clamp(elapsed / INTRO_FADE, 0, 1) : 1;
    for (let i = 0; i < count; i++) {
      const it = st.items[i];
      let u = p + offsetOf(i, count);
      if (introRunning) u = st.front + wrapSigned(u - st.front) * spread;
      const [x, y, , rawDy] = sample(u);
      const d = clamp(rawDy / st.rawYMax, -1, 1);
      const w = (d + 1) / 2;
      let scale = 1 + depth * (FRONT_GROW * w - BACK_SHRINK * (1 - w));
      let opacity = 1 - depth * BACK_DIM * (1 - w);

      // Occlude images when passing behind the central 3D crystal on the back half of the orbit (d < 0)
      if (d < 0 && depth > 0) {
        const backWeight = clamp(-d / 0.18, 0, 1);
        const nx = Math.abs(x - cx) / st.rawXMax;
        const edgeT = clamp((nx - 0.30) / (0.50 - 0.30), 0, 1);
        const centerVisibility = edgeT * edgeT * (3 - 2 * edgeT);
        const occlusionFactor = 1 - backWeight * (1 - centerVisibility);
        opacity *= occlusionFactor;
        scale *= 0.72 + 0.28 * occlusionFactor;
      }

      if (introRunning) {
        scale *= 0.7 + 0.3 * appear;
        opacity *= appear * appear * (3 - 2 * appear);
      }
      const sx = (x - cx) * st.scale + st.width / 2 - halfW;
      const sy = (y - cy) * st.scale + st.height / 2 - halfH;
      const rot = cfg.alignToPath ? heading(u) : 0;
      let z = depth > 0 ? (d <= 0 ? 10 + Math.round((d + 1) * 80) : 110 + Math.round(d * 80)) : 1;
      if (i === st.hoverIndex) z += 200;
      it.el.style.pointerEvents = opacity < 0.08 ? 'none' : '';
      it.el.style.visibility = opacity <= 0.01 ? 'hidden' : 'visible';
      write(
        it,
        't',
        'transform',
        `translate3d(${sx.toFixed(2)}px, ${sy.toFixed(2)}px, 0px)${rot ? ` rotate(${rot.toFixed(2)}deg)` : ''} scale(${scale.toFixed(4)})`
      );
      write(it, 'o', 'opacity', opacity > 0.999 ? '' : opacity.toFixed(3));
      write(it, 'z', 'zIndex', String(z));
    }
    if (introRunning) applyDash(easeOutQuint(clamp(elapsed / INTRO_SPREAD, 0, 1)));
  };

  const frame = (now: number) => {
    st.raf = 0;
    if (st.destroyed) return;
    const cfg = config.current;
    const dt = st.last ? clamp((now - st.last) / 1000, 0, 0.1) : 0;
    st.last = now;
    let busy = false;
    if (st.lut && st.scale && st.introStart === -1 && !st.introDone && st.visible) {
      if (cfg.intro) {
        st.introStart = now;
      } else {
        st.introDone = true;
      }
      root.removeAttribute('data-intro');
    }
    if (st.introStart >= 0) {
      if ((now - st.introStart) / 1000 >= INTRO_SPREAD) {
        st.introStart = -2;
        st.introDone = true;
        applyDash(1);
      } else {
        busy = true;
      }
    }
    const mult = cfg.speedMultiplier ?? 1;
    const want =
      cfg.paused || st.seek
        ? 0
        : mult > 1
          ? mult
          : (st.hovered ? clamp(cfg.hoverSpeed, 0, 1) : 1) * mult;
    if (st.speed !== want) {
      st.speed += (want - st.speed) * (1 - Math.exp(-dt / 0.25));
      if (Math.abs(st.speed - want) < 0.002) st.speed = want;
      busy = true;
    }
    if (st.speed > 0 && cfg.duration > 0) {
      st.lap += (dt * st.speed) / cfg.duration;
      busy = true;
    }
    let completedSeekIndex = -1;
    if (st.drag?.active) {
      busy = true;
    } else if (st.seek) {
      st.seek.t = Math.min(1, st.seek.t + dt / st.seek.dur);
      const e = st.seek.t < 0.5 ? 4 * st.seek.t ** 3 : 1 - Math.pow(-2 * st.seek.t + 2, 3) / 2;
      st.manual = st.seek.from + st.seek.delta * e;
      if (st.seek.t >= 1) {
        if (st.seek.notify && st.seek.targetIndex !== undefined) {
          completedSeekIndex = st.seek.targetIndex;
        }
        st.seek = null;
      }
      busy = true;
    } else if (st.glide) {
      st.manual += st.glide * dt;
      st.glide *= Math.exp(-dt / 0.7);
      if (Math.abs(st.glide) < 0.0004) st.glide = 0;
      busy = true;
    }
    render(now);
    if (completedSeekIndex >= 0) {
      const targetEl = st.items[completedSeekIndex]?.el;
      const rect = targetEl ? targetEl.getBoundingClientRect() : undefined;
      cfg.onItemClick?.(completedSeekIndex, cfg.sources[completedSeekIndex], rect);
    }
    const whole = Math.floor(st.lap);
    if (whole) st.lap -= whole;
    if (!st.drag && !st.seek) st.manual -= Math.floor(st.manual);
    const keepRunning = !st.destroyed && st.visible && (!cfg.paused || busy);
    if (keepRunning) st.raf = requestAnimationFrame(frame);
  };

  const wake = () => {
    if (st.raf || st.destroyed) return;
    st.visible = true;
    st.last = 0;
    st.raf = requestAnimationFrame(frame);
  };

  const local = (e: PointerEvent): [number, number] => {
    const r = root.getBoundingClientRect();
    const k = root.offsetWidth ? r.width / root.offsetWidth || 1 : 1;
    return [(e.clientX - r.left) / k, (e.clientY - r.top) / k];
  };

  const dragRate = () => {
    if (!st.lut || !st.scale) return 0;
    const a = sample(st.front - 3 / SAMPLES);
    const b = sample(st.front + 3 / SAMPLES);
    const along = ((b[0] - a[0]) / (6 / SAMPLES)) * st.scale;
    const floor = st.length * st.scale * 0.35;
    return Math.abs(along) < floor ? Math.sign(along || 1) * floor : along;
  };

  const itemIndex = (target: EventTarget | null) => {
    const el = target instanceof Element ? target.closest('[data-orbit-item]') : null;
    return el && root.contains(el) ? Number(el.getAttribute('data-orbit-item')) : -1;
  };

  const bringToFront = (index: number, notify = false) => {
    if (!st.lut || index < 0) return;
    const u = progress() + offsetOf(index, st.items.length);
    const delta = wrapSigned(st.front - u);
    st.glide = 0;
    st.speed = 0;
    if (Math.abs(delta) < 0.012) {
      st.manual += delta;
      st.seek = null;
      render(performance.now());
      if (notify) {
        const targetEl = st.items[index]?.el;
        const rect = targetEl ? targetEl.getBoundingClientRect() : undefined;
        config.current.onItemClick?.(index, config.current.sources[index], rect);
      }
      return;
    }
    st.seek = {
      from: st.manual,
      delta,
      t: 0,
      dur: 0.4 + Math.abs(delta) * 1.15,
      targetIndex: index,
      notify,
    };
    wake();
  };

  const onEnter = () => {
    st.hovered = true;
    wake();
  };

  const onLeave = () => {
    st.hovered = false;
    st.hoverIndex = -1;
    wake();
  };

  const onOver = (e: PointerEvent) => {
    const index = itemIndex(e.target);
    if (index !== st.hoverIndex) {
      st.hoverIndex = index;
      if (st.lut) render(performance.now());
    }
  };

  const onDown = (e: PointerEvent) => {
    const cfg = config.current;
    if (!cfg.draggable || (e.pointerType === 'mouse' && e.button !== 0)) return;
    if (e.target instanceof Element && e.target.closest('[data-orbit-center]')) return;
    const [x, y] = local(e);
    st.drag = { id: e.pointerId, x, y, active: false, samples: [], rate: dragRate(), anchor: 0, manual: 0 };
  };

  const onMove = (e: PointerEvent) => {
    const d = st.drag;
    if (!d || e.pointerId !== d.id) return;
    const [x, y] = local(e);
    const along = x - d.x;
    if (!d.active) {
      if (Math.abs(along) < DRAG_THRESHOLD) return;
      if (Math.abs(y - d.y) > Math.abs(along)) {
        st.drag = null;
        return;
      }
      d.active = true;
      d.anchor = along;
      d.manual = st.manual;
      st.seek = null;
      st.glide = 0;
      try {
        root.setPointerCapture(e.pointerId);
      } catch {}
      root.setAttribute('data-dragging', '');
    }
    if (d.rate) st.manual = d.manual + (along - d.anchor) / d.rate;
    const now = performance.now();
    d.samples.push([now, along]);
    while (d.samples.length > 2 && now - d.samples[0][0] > 100) d.samples.shift();
    wake();
  };

  const endDrag = (e: PointerEvent, cancelled: boolean) => {
    const d = st.drag;
    if (!d || e.pointerId !== d.id) return;
    st.drag = null;
    if (!d.active) return;
    root.removeAttribute('data-dragging');
    try {
      root.releasePointerCapture(e.pointerId);
    } catch {}
    const now = performance.now();
    st.suppressUntil = now + 400;
    const s = d.samples;
    if (!cancelled && s.length > 1 && d.rate) {
      const [t0, a0] = s[0];
      const [t1, a1] = s[s.length - 1];
      if (t1 > t0 && now - t1 < 80) {
        st.glide = clamp((((a1 - a0) / (t1 - t0)) * 1000) / d.rate, -3, 3);
      }
    }
    wake();
  };

  const onUp = (e: PointerEvent) => endDrag(e, false);
  const onCancel = (e: PointerEvent) => endDrag(e, true);

  const activate = (index: number) => {
    const cfg = config.current;
    if (index < 0) return;
    if (cfg.clickToFront) {
      bringToFront(index, true);
      return;
    }
    const targetEl = st.items[index]?.el;
    const rect = targetEl ? targetEl.getBoundingClientRect() : undefined;
    cfg.onItemClick?.(index, cfg.sources[index], rect);
  };

  const onClick = (e: MouseEvent) => {
    if (performance.now() < st.suppressUntil) {
      e.preventDefault();
      e.stopPropagation();
      st.suppressUntil = 0;
      return;
    }
    const idx = itemIndex(e.target);
    if (idx >= 0 && e.target instanceof Element) {
      const actionBtn = e.target.closest('[data-orbit-action]');
      if (actionBtn) {
        e.stopPropagation();
        const action = actionBtn.getAttribute('data-orbit-action');
        if (action === 'register') {
          config.current.onRegister?.(idx);
          return;
        }
      }
    }
    activate(idx);
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const index = itemIndex(e.target);
    if (index < 0) return;
    e.preventDefault();
    activate(index);
  };

  const onFocus = (e: FocusEvent) => {
    const index = itemIndex(e.target);
    if (
      index >= 0 &&
      config.current.clickToFront &&
      e.target instanceof Element &&
      e.target.matches(':focus-visible')
    ) {
      bringToFront(index);
    }
  };

  const onMotion = () => {
    st.reduced = false;
    wake();
  };

  root.addEventListener('pointerenter', onEnter);
  root.addEventListener('pointerleave', onLeave);
  root.addEventListener('pointerover', onOver);
  root.addEventListener('pointerdown', onDown);
  root.addEventListener('pointermove', onMove);
  root.addEventListener('pointerup', onUp);
  root.addEventListener('pointercancel', onCancel);
  root.addEventListener('lostpointercapture', onCancel);
  root.addEventListener('click', onClick);
  root.addEventListener('keydown', onKey);
  root.addEventListener('focusin', onFocus);
  query?.addEventListener?.('change', onMotion);

  let resizeObserver: ResizeObserver | null = null;
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      layout();
      render(performance.now());
      wake();
    });
    resizeObserver.observe(root);
  }

  let intersection: IntersectionObserver | null = null;
  if (typeof IntersectionObserver !== 'undefined') {
    intersection = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (entry.isIntersecting) {
          st.visible = true;
          wake();
          return;
        }
        const r = root.getBoundingClientRect();
        const inViewport =
          r.width > 0 &&
          r.height > 0 &&
          r.bottom > 0 &&
          r.top < window.innerHeight &&
          r.right > 0 &&
          r.left < window.innerWidth;
        st.visible = inViewport;
        if (inViewport) wake();
      },
      { threshold: 0 }
    );
    intersection.observe(root);
  }

  const onVisibility = () => {
    if (!document.hidden) wake();
  };
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('resize', wake);

  const refresh = () => {
    collect();
    build();
    layout();
    render(performance.now());
    wake();
  };

  const destroy = () => {
    st.destroyed = true;
    if (st.raf) cancelAnimationFrame(st.raf);
    root.removeEventListener('pointerenter', onEnter);
    root.removeEventListener('pointerleave', onLeave);
    root.removeEventListener('pointerover', onOver);
    root.removeEventListener('pointerdown', onDown);
    root.removeEventListener('pointermove', onMove);
    root.removeEventListener('pointerup', onUp);
    root.removeEventListener('pointercancel', onCancel);
    root.removeEventListener('lostpointercapture', onCancel);
    root.removeEventListener('click', onClick);
    root.removeEventListener('keydown', onKey);
    root.removeEventListener('focusin', onFocus);
    query?.removeEventListener?.('change', onMotion);
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('resize', wake);
    resizeObserver?.disconnect();
    intersection?.disconnect();
  };

  return { refresh, wake, destroy };
};

export default function OrbitImages({
  images = [],
  altPrefix = 'Orbiting image',
  shape = 'ellipse',
  customPath,
  baseWidth = 1400,
  radiusX = 700,
  radiusY = 170,
  radius = 300,
  starPoints = 5,
  starInnerRatio = 0.5,
  rotation = -8,
  duration = 40,
  itemSize = 64,
  itemWidth,
  itemHeight,
  direction = 'normal',
  fill = true,
  width = '100%',
  height = 'auto',
  className = '',
  showPath = false,
  pathColor = 'rgba(128,128,128,0.35)',
  pathWidth = 2,
  pathDash = 0,
  easing = 'linear',
  paused = false,
  depth = 0.5,
  itemRadius = 12,
  shadow = 0.3,
  hoverScale = 1.08,
  hoverSpeed = 0.3,
  draggable = true,
  clickToFront = true,
  onItemClick,
  onViewDetails,
  onRegister,
  alignToPath = false,
  intro = true,
  speedMultiplier = 1,
  centerContent,
}: OrbitImagesProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<ReturnType<typeof createEngine> | null>(null);
  const clipId = useId().replace(/:/g, '');
  const [introPending] = useState(intro);
  const [measuredAspect, setAspect] = useState<number | null>(null);

  const resolvedItemWidth = itemWidth ?? itemSize;
  const resolvedItemHeight = itemHeight ?? itemSize;

  const center = baseWidth / 2;

  const path = useMemo(() => {
    switch (shape) {
      case 'circle':
        return generateCirclePath(center, center, radius);
      case 'ellipse':
        return generateEllipsePath(center, center, radiusX, radiusY);
      case 'square':
        return generateSquarePath(center, center, radius * 2);
      case 'rectangle':
        return generateRectanglePath(center, center, radiusX * 2, radiusY * 2);
      case 'triangle':
        return generateTrianglePath(center, center, radius * 2);
      case 'star':
        return generateStarPath(center, center, radius, radius * starInnerRatio, starPoints);
      case 'heart':
        return generateHeartPath(center, center, radius * 2);
      case 'infinity':
        return generateInfinityPath(center, center, radiusX * 2, radiusY * 2);
      case 'wave':
        return generateWavePath(center, center, radiusX * 2, radiusY, 3);
      case 'custom':
        return customPath || generateCirclePath(center, center, radius);
      default:
        return generateEllipsePath(center, center, radiusX, radiusY);
    }
  }, [shape, customPath, center, radiusX, radiusY, radius, starPoints, starInnerRatio]);

  const items = useMemo(
    () =>
      images.map((image, index) =>
        typeof image === 'string'
          ? { src: image, alt: `${altPrefix} ${index + 1}` }
          : {
              id: image.id,
              src: image.src ?? '',
              alt: image.alt ?? image.title ?? `${altPrefix} ${index + 1}`,
              code: image.code,
              eligibility: image.eligibility,
              title: image.title,
              description: image.description,
              accentColor: image.accentColor,
              accentRgb: image.accentRgb,
            }
      ),
    [images, altPrefix]
  );

  const interactive = !!(onItemClick || onViewDetails || onRegister);

  const config = useRef<EngineConfig>(null!);
  config.current = {
    baseWidth,
    rotation,
    duration,
    itemSize,
    itemWidth: resolvedItemWidth,
    itemHeight: resolvedItemHeight,
    direction,
    fill,
    pathWidth,
    pathDash,
    easing,
    paused,
    depth,
    hoverScale,
    hoverSpeed,
    draggable,
    clickToFront,
    onItemClick,
    onViewDetails,
    onRegister,
    alignToPath,
    intro,
    speedMultiplier,
    sources: items.map((item) => item.src || item.title || ''),
  };

  useIsomorphicLayoutEffect(() => {
    if (!rootRef.current) return;
    const engine = createEngine(rootRef.current, config, setAspect);
    engineRef.current = engine;
    engine.refresh();
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [path, rotation, depth]);

  useIsomorphicLayoutEffect(() => {
    engineRef.current?.refresh();
  }, [
    path,
    rotation,
    baseWidth,
    itemSize,
    resolvedItemWidth,
    resolvedItemHeight,
    depth,
    hoverScale,
    items.length,
    showPath,
    pathWidth,
    pathDash,
    measuredAspect,
    height,
  ]);

  useEffect(() => {
    engineRef.current?.wake();
  });

  const aspect =
    measuredAspect ??
    estimateAspect({
      shape,
      radiusX,
      radiusY,
      radius,
      itemSize: Math.max(itemSize, resolvedItemWidth, resolvedItemHeight),
    });
  const autoHeight = height === 'auto' || height === undefined;
  const layered = depth > 0 && !!centerContent;

  const containerStyle: CSSProperties & Record<string, string | number | undefined> = {
    width: toCssLength(width),
    height: autoHeight ? undefined : toCssLength(height),
    aspectRatio: autoHeight ? String(aspect) : undefined,
    '--orbit-radius':
      typeof itemRadius === 'number'
        ? `${itemRadius}px`
        : itemRadius,
    '--orbit-shadow': String(clamp(shadow, 0, 1)),
    '--orbit-hover-scale': String(hoverScale),
  };

  return (
    <div
      ref={rootRef}
      className={`orbit-container ${className}`.trim()}
      style={containerStyle}
      aria-hidden={interactive ? undefined : true}
      data-intro={introPending ? '' : undefined}
      data-draggable={draggable ? '' : undefined}
    >
      <svg
        className="orbit-path-svg"
        data-orbit-svg=""
        preserveAspectRatio="none"
        style={{ zIndex: 0, visibility: showPath ? undefined : 'hidden' }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`${clipId}-back-occ`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="22%" stopColor="black" stopOpacity="1" />
            <stop offset="78%" stopColor="black" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="1" />
          </linearGradient>
          <mask
            id={`${clipId}-orbit-mask`}
            maskUnits="userSpaceOnUse"
            x="-1000"
            y="-1000"
            width={baseWidth + 2000}
            height={baseWidth + 2000}
          >
            <rect
              x="-1000"
              y="-1000"
              width={baseWidth + 2000}
              height={baseWidth + 2000}
              fill="white"
            />
            {depth > 0 && (
              <rect
                x={center - radiusX * 0.44}
                y={center - radiusY * 2.5}
                width={radiusX * 0.88}
                height={radiusY * 2.5}
                fill={`url(#${clipId}-back-occ)`}
              />
            )}
          </mask>
        </defs>
        <g transform={`rotate(${rotation} ${center} ${center})`}>
          <path
            data-orbit-path=""
            data-orbit-stroke=""
            d={path}
            fill="none"
            stroke={pathColor}
            strokeLinecap="round"
            mask={depth > 0 ? `url(#${clipId}-orbit-mask)` : undefined}
          />
        </g>
      </svg>
      {showPath && layered && (
        <svg
          className="orbit-path-svg"
          data-orbit-svg=""
          preserveAspectRatio="none"
          style={{ zIndex: 105 }}
          aria-hidden="true"
        >
          <defs>
            <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
              <rect data-orbit-clip="" />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clipId})`}>
            <path
              data-orbit-stroke=""
              d={path}
              fill="none"
              stroke={pathColor}
              strokeLinecap="round"
              transform={`rotate(${rotation} ${center} ${center})`}
            />
          </g>
        </svg>
      )}
      {items.map((item, index) => (
        <div
          key={index}
          className="orbit-item"
          data-orbit-item={index}
          data-clickable={clickToFront || interactive ? '' : undefined}
          role={interactive ? 'button' : undefined}
          tabIndex={interactive ? 0 : undefined}
          aria-label={interactive ? item.alt : undefined}
        >
          <div
            className="orbit-item-inner"
            style={
              item.accentColor && item.accentRgb
                ? getSolidCardVars(item.accentColor, item.accentRgb)
                : undefined
            }
          >
            {item.title ? (
              <div className="orbit-card">
                <div className="orbit-card-header">
                  <span className="orbit-card-code">
                    {item.code ?? `0${index + 1}`}
                  </span>
                  {item.eligibility && (
                    <span className="orbit-card-elig">{item.eligibility}</span>
                  )}
                  <span className="orbit-card-dot" />
                </div>
                <div className="orbit-card-body">
                  <h3 className="orbit-card-title">{item.title}</h3>
                  {item.description && (
                    <p className="orbit-card-desc">{item.description}</p>
                  )}
                </div>
                <div className="orbit-card-actions">
                  <button
                    type="button"
                    data-orbit-action="register"
                    className="orbit-card-btn orbit-card-btn-register"
                  >
                    Register
                  </button>
                </div>
              </div>
            ) : (
              <img
                src={item.src}
                alt={item.alt}
                draggable={false}
                decoding="async"
                className="orbit-image"
              />
            )}
          </div>
        </div>
      ))}
      {centerContent && (
        <div className="orbit-center-content" data-orbit-center="">
          {centerContent}
        </div>
      )}
    </div>
  );
}
