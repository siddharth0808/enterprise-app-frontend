import styled from 'styled-components';
import { media } from '../../../styles/breakpoints';

export const FormCard = styled.form`
  width: 100%;
  max-width: 640px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.card};
  padding: ${({ theme }) => theme.spacing(9)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};

  ${() => media.mobile`
    padding: 20px;
  `}
`;

export const SectionTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
`;

export const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing(4)};

  ${() => media.mobile`
    grid-template-columns: 1fr;
  `}
`;

export const FieldStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  text-transform: uppercase;
  letter-spacing: 0.04em;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.border};
  }
`;

export const FormActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(4)};
`;
