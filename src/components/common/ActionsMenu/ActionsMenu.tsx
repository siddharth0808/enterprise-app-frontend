import { useEffect, useRef, useState, type ReactNode } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
`;

const TriggerButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};

  &:hover {
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const Menu = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 160px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.card};
  padding: ${({ theme }) => theme.spacing(1.5)};
  display: flex;
  flex-direction: column;
  gap: 2px;
  z-index: 10;
`;

const MenuItem = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  text-align: left;
  padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(2.5)};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme, $danger }) => ($danger ? theme.colors.danger : theme.colors.textPrimary)};
  background: transparent;
  border: none;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

export interface ActionsMenuItem {
  label: string;
  onSelect: () => void;
  danger?: boolean;
}

interface ActionsMenuProps {
  items: ActionsMenuItem[];
  label?: string;
}

export function ActionsMenu({ items, label = 'Row actions' }: ActionsMenuProps) {
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
      <TriggerButton
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={(event) => {
          event.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
      >
        <MoreHorizontalIcon />
      </TriggerButton>
      {isOpen && (
        <Menu role="menu">
          {items.map((item) => (
            <MenuItem
              key={item.label}
              type="button"
              role="menuitem"
              $danger={item.danger}
              onClick={(event) => {
                event.stopPropagation();
                setIsOpen(false);
                item.onSelect();
              }}
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      )}
    </Wrapper>
  );
}

function MoreHorizontalIcon(): ReactNode {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}
