import type { CSSProperties, ReactElement } from 'react';

export interface TechTextProps {
  text?: string;
  fontFamily?: string;
  fontWeight?: number;
  fontSize?: number | 'inherit';
  letterSpacing?: number;
  color?: string;
  accentColor?: string;
  align?: 'left' | 'center' | 'right';
  reach?: number;
  softness?: number;
  dashLength?: number;
  dashGap?: number;
  strokeWidth?: number;
  lineStyle?: string;
  reveal?: string;
  specks?: number;
  selection?: boolean;
  labels?: boolean;
  draggable?: boolean;
  bounce?: number;
  sweep?: boolean;
  speed?: number;
  clickKick?: boolean;
  intro?: string;
  introDuration?: number;
  guides?: boolean;
  className?: string;
  style?: CSSProperties;
}

export default function TechText(props: TechTextProps): ReactElement;
