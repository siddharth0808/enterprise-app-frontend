import styled from 'styled-components';
import { media } from '../../../styles/breakpoints';

export const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(10)};
  background: ${({ theme }) => theme.colors.background};

  ${() => media.mobile`
    padding: 16px;
  `}
`;

export const Card = styled.div`
  width: 100%;
  max-width: 420px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: ${({ theme }) => theme.shadow.subtle};
  padding: ${({ theme }) => theme.spacing(9)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};
`;

export const WideCard = styled(Card)`
  max-width: 480px;
`;
