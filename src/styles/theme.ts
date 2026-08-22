// Central design tokens. Sourced from the InventoryFlow Figma file so that
// every styled-component references the same palette/spacing/radius scale
// instead of scattering literal values across the codebase.

export const theme = {
  colors: {
    background: '#f8fafc',
    surface: '#ffffff',
    border: '#e2e8f0',
    borderStrong: '#cbd5e1',

    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    textOnPrimary: '#ffffff',

    primary: '#0d9488',
    primaryHover: '#0b8177',
    primarySoft: '#f0fdfa',

    danger: '#dc2626',
    dangerSoft: '#fef2f2',
    dangerBorder: '#fecaca',

    warning: '#d97706',
    warningSoft: '#fef3c7',

    success: '#0d9488',
    successSoft: '#f0fdfa',
  },
  radius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    pill: '999px',
  },
  spacing: (multiplier: number) => `${multiplier * 4}px`,
  shadow: {
    card: '0px 8px 24px 0px rgba(15, 23, 42, 0.02)',
    subtle: '0px 8px 12px rgba(15, 23, 42, 0.02)',
  },
  font: {
    family: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    size: {
      xs: '12px',
      sm: '13px',
      base: '14px',
      md: '15px',
      lg: '16px',
      xl: '18px',
      xxl: '20px',
      xxxl: '24px',
    },
    weight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  breakpoints: {
    mobile: '600px',
    tablet: '1024px',
  },
} as const;

export type Theme = typeof theme;
