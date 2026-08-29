import styled from 'styled-components';
import type { ImportRecord, ImportRecordStatus } from '../types/import.types';
import { StatusBadge, type BadgeTone } from '../../../components/common/StatusBadge';
import { formatDate } from '../../../utils/formatters';

const TableWrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.card};
  overflow: hidden;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
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

const InvoiceCell = styled(Td)`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.font.weight.medium};
`;

const DetailsLink = styled.button`
  padding: ${({ theme }) => theme.spacing(1.5)} ${({ theme }) => theme.spacing(3)};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.medium};

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

const STATUS_META: Record<ImportRecordStatus, { label: string; tone: BadgeTone }> = {
  successful: { label: '✓ Imported', tone: 'success' },
  needs_review: { label: '⚠ Needs Review', tone: 'warning' },
  failed: { label: '✕ Failed', tone: 'danger' },
};

interface ImportHistoryTableProps {
  records: ImportRecord[];
  onViewDetails?: (record: ImportRecord) => void;
}

export function ImportHistoryTable({ records, onViewDetails }: ImportHistoryTableProps) {
  return (
    <TableWrapper>
      <Table>
        <Thead>
          <tr>
            <Th>Date</Th>
            <Th>Invoice Number</Th>
            <Th>Distributor</Th>
            <Th $align="right">Products</Th>
            <Th $align="right">Units</Th>
            <Th>Status</Th>
            <Th>Imported By</Th>
            <Th $align="right">Action</Th>
          </tr>
        </Thead>
        <tbody>
          {records.map((record) => {
            const statusMeta = STATUS_META[record.status];
            return (
              <Tr key={record.id}>
                <Td>{formatDate(record.importedAt)}</Td>
                <InvoiceCell>{record.invoiceNumber}</InvoiceCell>
                <Td>{record.distributor}</Td>
                <Td $align="right">
                  {record.productsImported} / {record.productsTotal}
                </Td>
                <Td $align="right">{record.unitsAdded.toLocaleString()}</Td>
                <Td>
                  <StatusBadge tone={statusMeta.tone}>{statusMeta.label}</StatusBadge>
                </Td>
                <Td>{record.importedBy || '—'}</Td>
                <Td $align="right">
                  <DetailsLink type="button" onClick={() => onViewDetails?.(record)}>
                    Details
                  </DetailsLink>
                </Td>
              </Tr>
            );
          })}
        </tbody>
      </Table>
    </TableWrapper>
  );
}
