import styled from 'styled-components';

const Bar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(4)};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(4)};
  flex-wrap: wrap;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
`;

const Divider = styled.div`
  width: 1px;
  height: 20px;
  background: ${({ theme }) => theme.colors.border};
`;

const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  flex-wrap: wrap;
`;

const ActionPill = styled.button<{ $danger?: boolean }>`
  padding: ${({ theme }) => theme.spacing(1.5)} ${({ theme }) => theme.spacing(3)};
  border-radius: ${({ theme }) => theme.radius.pill};
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  border: 1px solid ${({ theme, $danger }) => ($danger ? theme.colors.dangerBorder : theme.colors.border)};
  background: ${({ theme, $danger }) => ($danger ? theme.colors.dangerSoft : theme.colors.background)};
  color: ${({ theme, $danger }) => ($danger ? theme.colors.danger : theme.colors.textSecondary)};
  white-space: nowrap;

  &:hover {
    opacity: 0.85;
  }
`;

interface BulkActionBarProps {
  totalCount: number;
  selectedCount: number;
  allSelected: boolean;
  onToggleSelectAll: (selected: boolean) => void;
  onRemoveSelected: () => void;
  onMarkAsNew: () => void;
}

export function BulkActionBar({
  totalCount,
  selectedCount,
  allSelected,
  onToggleSelectAll,
  onRemoveSelected,
  onMarkAsNew,
}: BulkActionBarProps) {
  return (
    <Bar>
      <CheckboxLabel>
        <input
          type="checkbox"
          checked={allSelected}
          onChange={(event) => onToggleSelectAll(event.target.checked)}
        />
        {totalCount} product{totalCount === 1 ? '' : 's'} detected
      </CheckboxLabel>

      {selectedCount > 0 && (
        <>
          <Divider />
          <ActionsRow>
            <ActionPill type="button" $danger onClick={onRemoveSelected}>
              Remove Selected ({selectedCount})
            </ActionPill>
            <ActionPill type="button" onClick={onMarkAsNew}>
              Mark as New Product
            </ActionPill>
          </ActionsRow>
        </>
      )}
    </Bar>
  );
}
