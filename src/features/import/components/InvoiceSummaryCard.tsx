import styled from 'styled-components';

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing(5)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const Label = styled.span`
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Value = styled.span<{ $tone?: 'default' | 'warning' }>`
  font-size: ${({ theme }) => theme.font.size.xxxl};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  color: ${({ theme, $tone }) => ($tone === 'warning' ? theme.colors.warning : theme.colors.textPrimary)};
`;

interface InvoiceSummaryCardProps {
  label: string;
  value: number;
  tone?: 'default' | 'warning';
}

export function InvoiceSummaryCard({ label, value, tone = 'default' }: InvoiceSummaryCardProps) {
  return (
    <Card>
      <Label>{label}</Label>
      <Value $tone={tone}>{value}</Value>
    </Card>
  );
}
