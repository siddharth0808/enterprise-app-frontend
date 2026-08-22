import styled from 'styled-components';

export type BadgeTone = 'warning' | 'success' | 'neutral';

const toneStyles = {
  warning: {
    bg: '#fef3c7',
    fg: '#d97706',
  },
  success: {
    bg: '#f0fdfa',
    fg: '#0d9488',
  },
  neutral: {
    bg: '#f1f5f9',
    fg: '#475569',
  },
};

const Badge = styled.span<{ $tone: BadgeTone }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  background: ${({ $tone }) => toneStyles[$tone].bg};
  color: ${({ $tone }) => toneStyles[$tone].fg};
`;

interface StatusBadgeProps {
  tone: BadgeTone;
  children: React.ReactNode;
}

export function StatusBadge({ tone, children }: StatusBadgeProps) {
  return <Badge $tone={tone}>{children}</Badge>;
}
