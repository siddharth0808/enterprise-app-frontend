import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import type { Product } from '../types/product.types';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { ActionsMenu } from '../../../components/common/ActionsMenu';
import { formatCurrency } from '../../../utils/formatters';
import { getStockStatusMeta } from '../utils/stockStatus';
import { media } from '../../../styles/breakpoints';

const TableWrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.card};
  overflow: hidden;
  overflow-x: auto;

  ${() => media.tabletDown`
    display: none;
  `}
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1080px;
`;

const Thead = styled.thead`
  background: ${({ theme }) => theme.colors.background};
`;

const Th = styled.th<{ $align?: 'left' | 'right' }>`
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(6)};
  text-align: ${({ $align = 'left' }) => $align};
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  white-space: nowrap;
`;

const Tr = styled.tr`
  cursor: pointer;

  &:hover td {
    background: ${({ theme }) => theme.colors.background};
  }

  &:not(:last-child) td {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const Td = styled.td<{ $align?: 'left' | 'right' }>`
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(6)};
  text-align: ${({ $align = 'left' }) => $align};
  font-size: ${({ theme }) => theme.font.size.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
`;

const ProductName = styled(Td)`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.font.weight.medium};
`;

const StrongPrice = styled(Td)`
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ActionsCell = styled(Td)`
  text-align: right;
`;

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
  const navigate = useNavigate();

  return (
    <TableWrapper>
      <Table>
        <Thead>
          <tr>
            <Th>Product</Th>
            <Th>SKU</Th>
            <Th>Category</Th>
            <Th $align="right">Selling Price</Th>
            <Th $align="right">Cost Price</Th>
            <Th $align="right">Stock</Th>
            <Th $align="right">Min Stock</Th>
            <Th>Status</Th>
            <Th $align="right">Actions</Th>
          </tr>
        </Thead>
        <tbody>
          {products.map((product) => {
            const statusMeta = getStockStatusMeta(product.currentStock, product.minimumStock);
            return (
              <Tr key={product.id} onClick={() => navigate(`/products/${product.id}`)}>
                <ProductName>{product.name}</ProductName>
                <Td>{product.sku || '—'}</Td>
                <Td>{product.category || '—'}</Td>
                <StrongPrice $align="right">{formatCurrency(product.sellingPrice)}</StrongPrice>
                <Td $align="right">{formatCurrency(product.costPrice)}</Td>
                <Td $align="right">{product.currentStock}</Td>
                <Td $align="right">{product.minimumStock}</Td>
                <Td>
                  <StatusBadge tone={statusMeta.tone}>{statusMeta.label}</StatusBadge>
                </Td>
                <ActionsCell onClick={(event) => event.stopPropagation()}>
                  <ActionsMenu
                    label={`Actions for ${product.name}`}
                    items={[
                      { label: 'View Details', onSelect: () => navigate(`/products/${product.id}`) },
                      { label: 'Adjust Stock', onSelect: () => navigate(`/products/${product.id}/adjust-stock`) },
                      { label: 'View History', onSelect: () => navigate(`/products/${product.id}/history`) },
                      { label: 'Edit Product', onSelect: () => navigate(`/products/${product.id}/edit`) },
                    ]}
                  />
                </ActionsCell>
              </Tr>
            );
          })}
        </tbody>
      </Table>
    </TableWrapper>
  );
}
