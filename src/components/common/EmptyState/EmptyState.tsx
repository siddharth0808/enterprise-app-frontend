import type { ReactNode } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(12)} ${({ theme }) => theme.spacing(6)};
  width: 100%;
`;

const IconBadge = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primarySoft};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
`;

const Title = styled.p`
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.font.size.base};
  max-width: 360px;
`;

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Wrapper>
      <IconBadge>
        {icon ?? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path
              d="M3 3h18v6H3zM3 9v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9M8 14h8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </IconBadge>
      <Title>{title}</Title>
      {description && <Description>{description}</Description>}
      {action}
    </Wrapper>
  );
}
