import styled from 'styled-components';
import type { ProcessingStep } from '../types/import.types';

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
  width: 100%;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const IconSlot = styled.div<{ $state: ProcessingStep['state'] }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme, $state }) => ($state === 'done' ? theme.colors.primarySoft : 'transparent')};
  border: 1px solid
    ${({ theme, $state }) => ($state === 'pending' ? theme.colors.border : 'transparent')};
  color: ${({ theme, $state }) => ($state === 'done' ? theme.colors.primary : theme.colors.textMuted)};
`;

const PulsingDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
`;

const Label = styled.span<{ $state: ProcessingStep['state'] }>`
  font-size: ${({ theme }) => theme.font.size.base};
  font-weight: ${({ theme, $state }) => ($state === 'active' ? theme.font.weight.semibold : theme.font.weight.regular)};
  color: ${({ theme, $state }) => ($state === 'pending' ? theme.colors.textMuted : theme.colors.textPrimary)};
`;

interface InvoiceProcessingStepsProps {
  steps: ProcessingStep[];
}

export function InvoiceProcessingSteps({ steps }: InvoiceProcessingStepsProps) {
  return (
    <List>
      {steps.map((step) => (
        <Row key={step.label}>
          <IconSlot $state={step.state}>
            {step.state === 'done' && <CheckIcon />}
            {step.state === 'active' && <PulsingDot />}
          </IconSlot>
          <Label $state={step.state}>{step.label}</Label>
        </Row>
      ))}
    </List>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
