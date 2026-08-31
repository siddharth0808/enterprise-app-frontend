import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import type { Product } from "../types/product.types";
import { StatusBadge } from "../../../components/common/StatusBadge";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import { getStockStatusMeta } from "../utils/stockStatus";
import { media } from "../../../styles/breakpoints";

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

const Th = styled.th<{ $align?: "left" | "right" }>`
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(6)};
  text-align: ${({ $align = "left" }) => $align};
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  white-space: nowrap;
`;

// Pinned to the right edge of the scrollable table area (not the row/table
// itself), so the quick-action icons are reachable without scrolling
// horizontally, even on a narrow/resized viewport. No visible column
// header - it's an empty, unlabeled sticky header cell purely so the
// column widths still line up correctly.
const StickyTh = styled(Th)`
  position: sticky;
  right: 0;
  background: ${({ theme }) => theme.colors.background};
`;

const Tr = styled.tr`
  cursor: pointer;

  &:hover td {
    background: ${({ theme }) => theme.colors.background};
  }

  &:not(:last-child) td {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  /* Row-level quick actions stay invisible (but still in layout, so the
     column doesn't jump) until the row is hovered or a button inside it
     has keyboard focus - keeps the table quiet until it's needed. */
  &:hover .row-actions,
  .row-actions:focus-within {
    opacity: 1;
  }
`;

const Td = styled.td<{ $align?: "left" | "right" }>`
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(6)};
  text-align: ${({ $align = "left" }) => $align};
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

// Sticky right edge, same trick as StickyTh - keeps an opaque background so
// other cells' text doesn't show through while scrolled underneath it, and
// stays in view regardless of horizontal scroll position.
const ActionsCell = styled(Td)`
  text-align: right;
  position: sticky;
  right: 0;
  background: ${({ theme }) => theme.colors.surface};
`;

const RowActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  opacity: 0;
  transition: opacity 0.12s ease;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 1px;
  }
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
            <Th>Status</Th>
            <Th>Product</Th>
            <Th $align="right">MRP.</Th>
            <Th $align="right">RATE</Th>
            <Th $align="right">Stock</Th>
            <Th $align="right">Min Stock</Th>
            <Th $align="right">Expiry Date</Th>
            <Th>Batch No.</Th>

            <StickyTh aria-label="Actions" />
          </tr>
        </Thead>
        <tbody>
          {products.map((product) => {
            const statusMeta = getStockStatusMeta(
              product.currentStock,
              product.minimumStock,
            );
            return (
              <Tr
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <Td>
                  <StatusBadge tone={statusMeta.tone}>
                    {statusMeta.label}
                  </StatusBadge>
                </Td>
                <ProductName>{product.name}</ProductName>
                <StrongPrice $align="right">
                  {formatCurrency(product.mrp)}
                </StrongPrice>
                <Td $align="right">{formatCurrency(product.rate)}</Td>
                <Td $align="right">{product.currentStock}</Td>
                <Td $align="right">{product.minimumStock}</Td>
                <Td $align="right">
                  {formatDate(
                    product.expiryDate
                      ? new Date(product.expiryDate).toISOString()
                      : "",
                  )}
                </Td>
                <Td>{product.batchNumber || "—"}</Td>

                <ActionsCell onClick={(event) => event.stopPropagation()}>
                  <RowActions className="row-actions">
                    <IconButton
                      type="button"
                      title="View Details"
                      aria-label={`View details for ${product.name}`}
                      onClick={() =>
                        navigate(`/products/${product.id}?fromRow=true`)
                      }
                    >
                      <EyeIcon />
                    </IconButton>
                    <IconButton
                      type="button"
                      title="Adjust Stock"
                      aria-label={`Adjust stock for ${product.name}`}
                      onClick={() =>
                        navigate(
                          `/products/${product.id}/adjust-stock?fromRow=true`,
                        )
                      }
                    >
                      <AdjustIcon />
                    </IconButton>
                    <IconButton
                      type="button"
                      title="View History"
                      aria-label={`View history for ${product.name}`}
                      onClick={() =>
                        navigate(`/products/${product.id}/history?fromRow=true`)
                      }
                    >
                      <HistoryIcon />
                    </IconButton>
                    <IconButton
                      type="button"
                      title="Edit Product"
                      aria-label={`Edit ${product.name}`}
                      onClick={() =>
                        navigate(`/products/${product.id}/edit?fromRow=true`)
                      }
                    >
                      <EditIcon />
                    </IconButton>
                  </RowActions>
                </ActionsCell>
              </Tr>
            );
          })}
        </tbody>
      </Table>
    </TableWrapper>
  );
}

function EyeIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AdjustIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line
        x1="12"
        y1="19"
        x2="12"
        y2="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="5 12 12 5 19 12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M3 12a9 9 0 1 0 3-6.7L3 8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="3 3 3 8 8 8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="12 7 12 12 16 14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
