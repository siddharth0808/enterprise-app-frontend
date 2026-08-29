import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button } from '../../../components/common/Button';

const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
`;

const Menu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 260px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.card};
  padding: ${({ theme }) => theme.spacing(2)};
  display: flex;
  flex-direction: column;
  gap: 2px;
  z-index: 20;
`;

const MenuItem = styled.button<{ $highlight?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(3)};
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;
  background: ${({ theme, $highlight }) => ($highlight ? theme.colors.primarySoft : 'transparent')};
  text-align: left;
  width: 100%;

  &:hover {
    background: ${({ theme, $highlight }) => ($highlight ? theme.colors.primarySoft : theme.colors.background)};
    opacity: ${({ $highlight }) => ($highlight ? 0.9 : 1)};
  }
`;

const ItemIcon = styled.span<{ $highlight?: boolean }>`
  display: flex;
  flex-shrink: 0;
  color: ${({ theme, $highlight }) => ($highlight ? theme.colors.primary : theme.colors.textSecondary)};
`;

const ItemTextRow = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const ItemLabel = styled.span<{ $highlight?: boolean }>`
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme, $highlight }) => ($highlight ? theme.colors.primary : theme.colors.textPrimary)};
`;

const NewBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 1px 6px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textOnPrimary};
  font-size: 10px;
  font-weight: ${({ theme }) => theme.font.weight.bold};
  letter-spacing: 0.03em;
`;

interface AddInventoryMenuProps {
  onAddProductManually: () => void;
  onImportFromInvoice: () => void;
}

export function AddInventoryMenu({ onAddProductManually, onImportFromInvoice }: AddInventoryMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <Wrapper ref={containerRef}>
      <Button type="button" aria-haspopup="menu" aria-expanded={isOpen} onClick={() => setIsOpen((prev) => !prev)}>
        Add Inventory
        <ChevronDownIcon />
      </Button>
      {isOpen && (
        <Menu role="menu">
          <MenuItem
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              onAddProductManually();
            }}
          >
            <ItemIcon>
              <EditIcon />
            </ItemIcon>
            <ItemLabel>Add Product Manually</ItemLabel>
          </MenuItem>
          <MenuItem
            type="button"
            role="menuitem"
            $highlight
            onClick={() => {
              setIsOpen(false);
              onImportFromInvoice();
            }}
          >
            <ItemIcon $highlight>
              <FileTextIcon />
            </ItemIcon>
            <ItemTextRow>
              <ItemLabel $highlight>Import from Invoice</ItemLabel>
              <NewBadge>NEW</NewBadge>
            </ItemTextRow>
          </MenuItem>
        </Menu>
      )}
    </Wrapper>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z" />
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}
