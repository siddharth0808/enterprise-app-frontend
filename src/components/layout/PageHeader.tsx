import type { ReactNode } from 'react';
import styled from 'styled-components';
import { media } from '../../styles/breakpoints';

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(4)};
  width: 100%;

  ${() => media.mobile`
    flex-direction: column;
    align-items: flex-start;
  `}
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const Title = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.xxxl};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.base};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <Header>
      <TitleBlock>
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </TitleBlock>
      {action}
    </Header>
  );
}
