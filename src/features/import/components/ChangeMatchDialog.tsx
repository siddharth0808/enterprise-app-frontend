import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import type { Product } from '../../inventory/types/product.types';
import type { DetectedProduct } from '../types/import.types';

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(6)};
`;

const Dialog = styled.div`
  width: 100%;
  max-width: 480px;
  max-height: 80vh;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.card};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.div`
  padding: ${({ theme }) => theme.spacing(5)} ${({ theme }) => theme.spacing(6)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const Title = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const InvoiceProductLine = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SearchWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(6)};
`;

const OptionsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(3)};
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const OptionButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(3)};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid transparent;
  background: ${({ theme, $active }) => ($active ? theme.colors.primarySoft : 'transparent')};
  text-align: left;

  &:hover {
    background: ${({ theme, $active }) => ($active ? theme.colors.primarySoft : theme.colors.background)};
  }
`;

const OptionName = styled.span`
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const OptionMeta = styled.span`
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  flex-shrink: 0;
`;

const NewProductOption = styled(OptionButton)`
  border: 1px dashed ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(6)};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

interface ChangeMatchDialogProps {
  product: DetectedProduct;
  candidates: Product[];
  onClose: () => void;
  onSelectMatch: (matchedProductId: string | null, matchedName?: string) => void;
}

export function ChangeMatchDialog({ product, candidates, onClose, onSelectMatch }: ChangeMatchDialogProps) {
  const [query, setQuery] = useState('');

  const filteredCandidates = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return candidates;
    return candidates.filter(
      (candidate) =>
        candidate.name.toLowerCase().includes(trimmed) || candidate.sku?.toLowerCase().includes(trimmed)
    );
  }, [candidates, query]);

  return (
    <Backdrop onClick={onClose}>
      <Dialog onClick={(event) => event.stopPropagation()}>
        <Header>
          <Title>Change Match</Title>
          <InvoiceProductLine>Invoice product: “{product.detectedName}”</InvoiceProductLine>
        </Header>

        <SearchWrapper>
          <Input
            placeholder="Search existing products…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoFocus
          />
        </SearchWrapper>

        <OptionsList>
          <NewProductOption type="button" onClick={() => onSelectMatch(null)}>
            <OptionName>+ Treat as New Product</OptionName>
          </NewProductOption>

          {filteredCandidates.map((candidate) => (
            <OptionButton
              key={candidate.id}
              type="button"
              $active={candidate.id === product.matchedProductId}
              onClick={() => onSelectMatch(candidate.id, candidate.name)}
            >
              <OptionName>{candidate.name}</OptionName>
              <OptionMeta>{candidate.sku || '—'}</OptionMeta>
            </OptionButton>
          ))}
        </OptionsList>

        <Footer>
          <Button type="button" $variant="secondary" onClick={onClose}>
            Close
          </Button>
        </Footer>
      </Dialog>
    </Backdrop>
  );
}
