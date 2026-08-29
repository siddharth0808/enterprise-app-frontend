import type { ReactNode } from 'react';
import styled, { keyframes } from 'styled-components';
import type { ProcessingStep } from '../types/import.types';
import { InvoiceProcessingSteps } from './InvoiceProcessingSteps';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  width: 100%;
`;

const Card = styled.div`
  width: 100%;
  max-width: 560px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: ${({ theme }) => theme.shadow.card};
  padding: ${({ theme }) => theme.spacing(9)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(7)};
`;

const HeaderBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${({ theme }) => theme.spacing(5)};
`;

const Spinner = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 4px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.primary};
  animation: ${spin} 0.8s linear infinite;
`;

const Title = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.xxl};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Message = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 420px;
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
`;

const FooterSlot = styled.div`
  display: flex;
  justify-content: center;
`;

interface ImportProgressProps {
  title: string;
  message: string;
  steps: ProcessingStep[];
  footer?: ReactNode;
}

export function ImportProgress({ title, message, steps, footer }: ImportProgressProps) {
  return (
    <Wrapper>
      <Card>
        <HeaderBlock>
          <Spinner role="status" aria-label={title} />
          <div>
            <Title>{title}</Title>
            <Message>{message}</Message>
          </div>
        </HeaderBlock>
        <Divider />
        <InvoiceProcessingSteps steps={steps} />
        {footer && <FooterSlot>{footer}</FooterSlot>}
      </Card>
    </Wrapper>
  );
}
