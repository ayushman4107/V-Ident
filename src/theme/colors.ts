// V-IDENT Cyberpunk-Neon Color Palette
export const Colors = {
  // Backgrounds
  bgPrimary: '#0A0A1F',
  bgSecondary: '#0D0D2B',
  bgCard: '#111135',
  bgCardAlt: '#0F0F2D',
  bgOverlay: 'rgba(10, 10, 31, 0.85)',

  // Neon Accents
  neonCyan: '#00D4FF',
  neonCyanDim: 'rgba(0, 212, 255, 0.3)',
  neonCyanGlow: 'rgba(0, 212, 255, 0.15)',
  neonMagenta: '#FF00AA',
  neonMagentaDim: 'rgba(255, 0, 170, 0.3)',
  neonMagentaGlow: 'rgba(255, 0, 170, 0.15)',

  // Status
  success: '#00FF9D',
  successDim: 'rgba(0, 255, 157, 0.3)',
  successGlow: 'rgba(0, 255, 157, 0.15)',
  warning: '#FF3366',
  warningDim: 'rgba(255, 51, 102, 0.3)',
  warningGlow: 'rgba(255, 51, 102, 0.15)',
  
  // Text
  textPrimary: '#E0F7FF',
  textSecondary: '#A0C0FF',
  textMuted: '#5A6A8A',
  textDark: '#2A3050',

  // Gradients
  gradientBlue: ['#1A0A4A', '#0A0A1F'],
  gradientCyan: ['#00D4FF', '#0066FF'],
  gradientMagenta: ['#FF00AA', '#7700FF'],
  gradientSuccess: ['#00FF9D', '#00BBFF'],
  gradientDanger: ['#FF3366', '#FF0066'],
  gradientOrb: ['#1A1A5C', '#2A0A5C', '#0A0A2F'],
  gradientCardBorder: ['#00D4FF', '#FF00AA'],

  // Misc
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  border: 'rgba(0, 212, 255, 0.2)',
  borderLight: 'rgba(160, 192, 255, 0.1)',
} as const;

export type ColorKey = keyof typeof Colors;
