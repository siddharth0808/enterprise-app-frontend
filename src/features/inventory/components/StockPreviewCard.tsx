import styled from 'styled-components';
import { getTransactionLabel, getTransactionSign, type TransactionType } from '../types/transaction.types';
import { formatCurrency, formatSignedQuantity } from '../../../utils/formatters';
import { FormError } from '../../auth/components/AuthCard.styles';

const Card = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.card};
  padding: ${({ theme }) => theme.spacing(8)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};
  height: fit-content;
`;

const Title = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Rows = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Label = styled.span`
  font-size: ${({ theme }) => theme.font.size.base};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Value = styled.span`
  font-size: ${({ theme }) => theme.font.size.base};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const AdjustmentValue = styled(Value)<{ $positive: boolean }>`
  color: ${({ theme, $positive }) => ($positive ? theme.colors.primary : theme.colors.danger)};
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
`;

const ResultLabel = styled.span`
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ResultValue = styled.span`
  font-size: ${({ theme }) => theme.font.size.xxl};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const Note = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing(3)};
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

interface StockPreviewCardProps {
  currentStock: number;
  rate:number;
  type: TransactionType;
  quantity: number;
}

export function StockPreviewCard({ currentStock,rate, type, quantity }: StockPreviewCardProps) {
  const sign = getTransactionSign(type);
  const signedQuantity = sign * Math.abs(quantity || 0);
  const newStock =  currentStock + signedQuantity
  const expectedStock = Math.max(0, newStock);
  const isNegetiveStock =  newStock < 0;
  const amount =  Number(expectedStock) * Number(rate)
  return (
    <Card>
      {isNegetiveStock && <FormError role="alert">Adjustment quantity could not be greater than current stock</FormError>}
      <Title>Stock Preview</Title>
      <Rows>
        <Row>
          <Label>Current Stock</Label>
          <Value>{currentStock}</Value>
        </Row>
        <Row>
          <Label>Adjustment</Label>
          <AdjustmentValue $positive={sign > 0}>
            {formatSignedQuantity(signedQuantity)} ({getTransactionLabel(type)})
          </AdjustmentValue>
        </Row>
        <Divider />
        <Row>
          <ResultLabel>New Expected Stock</ResultLabel>
          <ResultValue>{expectedStock} Units</ResultValue>
        </Row>
        <Row>
          <Label>Expected Total Amt.</Label>
          <Value>{formatCurrency(amount)}</Value>
        </Row>
      </Rows>
      <Note>
        Verify the expected stock level before saving. This action will write a transaction record to
        history logs.
      </Note>
    </Card>
  );
}
