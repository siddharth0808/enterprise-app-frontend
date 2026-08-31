import styled from 'styled-components';
import type { InvoiceProducts } from '../types/import.types';
import { ActionsMenu } from '../../../components/common/ActionsMenu';
import { ProductMatchBadge } from './ProductMatchBadge';
import { expiryDate, formatCurrency } from '../../../utils/formatters';

const Row = styled.tr<{ $selected: boolean }>`
  background: ${({ theme, $selected }) => ($selected ? theme.colors.primarySoft : 'transparent')};

  &:not(:last-child) td {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const Td = styled.td<{ $align?: 'left' | 'right' }>`
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(4)};
  text-align: ${({ $align = 'left' }) => $align};
  font-size: ${({ theme }) => theme.font.size.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
`;

const ProductNameCell = styled(Td)`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  white-space: normal;
  max-width: 220px;
`;

const ActionsCell = styled(Td)`
  text-align: right;
`;

interface InvoiceReviewRowProps {
  product: InvoiceProducts;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
}

export function InvoiceReviewRow({
  product,
  onEdit,
  onRemove,
}: InvoiceReviewRowProps) {
  return (
    <Row $selected={false}>
      <Td>
        <ProductMatchBadge matchType={product.status} />
      </Td>
      <ProductNameCell>{product.name || <em>Unnamed product</em>}</ProductNameCell>
      <Td $align="right">{product.quantity}</Td>
      <Td $align="right">{product.currentQuantity}</Td>
      <Td $align="right">{product.currentQuantity + product.quantity}</Td>

      <Td $align="right">{formatCurrency(product.rate)}</Td>
      <Td $align="right">{product.mrp ? formatCurrency(product.mrp) : '—'}</Td>
      <Td $align="right">{expiryDate(product.expiryDate)}</Td>
      <Td $align="right">{formatCurrency(product.amount)}</Td>
      <ActionsCell>
        <ActionsMenu
          label={`Actions for ${product.name}`}
          items={[
            { label: 'Edit', onSelect: () => onEdit(product.id) },
            { label: 'Remove', onSelect: () => onRemove(product.id), danger: true },
          ]}
        />
      </ActionsCell>
    </Row>
  );
}
