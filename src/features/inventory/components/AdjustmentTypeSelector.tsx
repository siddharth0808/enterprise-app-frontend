import styled from "styled-components";
import {
  TRANSACTION_TYPE_OPTIONS,
  type TransactionType
} from "../types/transaction.types";

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const Pill = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(4)};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.primary : theme.colors.border};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primarySoft : theme.colors.surface};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.textSecondary};

  &:hover {
    border-color: ${({ theme, $active }) =>
      $active ? theme.colors.primary : theme.colors.borderStrong};
  }
`;

interface AdjustmentTypeSelectorProps {
  value: TransactionType;
  onChange: (type: TransactionType) => void;
}

export function AdjustmentTypeSelector({
  value,
  onChange,
}: AdjustmentTypeSelectorProps) {
  return (
    <Row role="radiogroup" aria-label="Adjustment type">
      {TRANSACTION_TYPE_OPTIONS.map((option) => (
        <Pill
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          $active={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Pill>
      ))}
    </Row>
  );
}
