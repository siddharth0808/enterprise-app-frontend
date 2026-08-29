import styled from 'styled-components';
import { Button } from '../../../components/common/Button';
import type { ImportResultData } from '../types/import.types';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  width: 100%;
`;

const Card = styled.div`
  width: 100%;
  max-width: 580px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: ${({ theme }) => theme.shadow.card};
  padding: ${({ theme }) => theme.spacing(9)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(7)};
`;

const HeaderBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${({ theme }) => theme.spacing(5)};
`;

const IconBadge = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primarySoft};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.xxl};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Message = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.base};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
`;

const MetaRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(8)};
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MetaLabel = styled.span`
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const MetaValue = styled.span`
  font-size: ${({ theme }) => theme.font.size.base};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const StatsPanel = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing(5)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const StatsTitle = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const StatRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StatLabel = styled.span`
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StatValue = styled.span`
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const TotalRow = styled(StatRow)`
  padding-top: ${({ theme }) => theme.spacing(3)};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const TotalValue = styled(StatValue)`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.font.size.md};
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(3)};
`;

interface ImportSuccessProps {
  result: ImportResultData;
  onViewInventory: () => void;
  onViewImportDetails: () => void;
}

export function ImportSuccess({ result, onViewInventory, onViewImportDetails }: ImportSuccessProps) {
  return (
    <Wrapper>
      <Card>
        <HeaderBlock>
          <IconBadge>
            <CheckIcon />
          </IconBadge>
          <div>
            <Title>Inventory Imported Successfully</Title>
            <Message>Invoice processing completed. All items are updated in your inventory.</Message>
          </div>
        </HeaderBlock>

        <Divider />

        <MetaRow>
          <MetaItem>
            <MetaLabel>Invoice</MetaLabel>
            <MetaValue>{result.invoice.invoiceNumber}</MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>Distributor</MetaLabel>
            <MetaValue>{result.invoice.distributor}</MetaValue>
          </MetaItem>
        </MetaRow>

        <StatsPanel>
          <StatsTitle>Summary Report</StatsTitle>
          <StatRow>
            <StatLabel>Products Processed</StatLabel>
            <StatValue>{result.productsProcessed}</StatValue>
          </StatRow>
          <StatRow>
            <StatLabel>Existing Products Updated</StatLabel>
            <StatValue>{result.existingProductsUpdated}</StatValue>
          </StatRow>
          <StatRow>
            <StatLabel>New Products Created</StatLabel>
            <StatValue>{result.newProductsCreated}</StatValue>
          </StatRow>
          <TotalRow>
            <StatLabel>Total Units Added</StatLabel>
            <TotalValue>{result.totalUnitsAdded.toLocaleString()} units</TotalValue>
          </TotalRow>
        </StatsPanel>

        <Actions>
          <Button type="button" $variant="secondary" onClick={onViewImportDetails}>
            View Import Details
          </Button>
          <Button type="button" onClick={onViewInventory}>
            View Inventory
          </Button>
        </Actions>
      </Card>
    </Wrapper>
  );
}

function CheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
