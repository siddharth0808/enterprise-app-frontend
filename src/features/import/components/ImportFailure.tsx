import { useState } from 'react';
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
  background: ${({ theme }) => theme.colors.warningSoft};
  color: ${({ theme }) => theme.colors.warning};
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

const ProgressLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${({ theme }) => theme.font.size.sm};
`;

const SuccessLabel = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.font.weight.medium};
`;

const WarningLabel = styled.span`
  color: ${({ theme }) => theme.colors.warning};
  font-weight: ${({ theme }) => theme.font.weight.medium};
`;

const ProgressTrack = styled.div`
  height: 8px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.warningSoft};
  overflow: hidden;
  display: flex;
`;

const ProgressFill = styled.div<{ $percent: number }>`
  width: ${({ $percent }) => $percent}%;
  background: ${({ theme }) => theme.colors.primary};
`;

const AlertBox = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(3)};
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing(4)};
`;

const AlertIcon = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  flex-shrink: 0;
`;

const AlertText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const FailedItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const FailedItemRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: ${({ theme }) => theme.spacing(3)};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const FailedItemName = styled.span`
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const FailedItemReason = styled.span`
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme }) => theme.colors.danger};
`;

interface ImportFailureProps {
  result: ImportResultData;
  onViewInventory: () => void;
  onReviewFailedItems?: () => void;
}

export function ImportFailure({ result, onViewInventory, onReviewFailedItems }: ImportFailureProps) {
  const [showDetails, setShowDetails] = useState(false);
  const successCount = result.productsProcessed - result.failedItems.length;
  const percent = result.productsProcessed > 0 ? (successCount / result.productsProcessed) * 100 : 0;

  const handleReviewFailedItems = () => {
    setShowDetails((prev) => !prev);
    onReviewFailedItems?.();
  };

  return (
    <Wrapper>
      <Card>
        <HeaderBlock>
          <IconBadge>
            <AlertTriangleIcon />
          </IconBadge>
          <div>
            <Title>Inventory Import Completed</Title>
            <Message>
              {successCount} products imported successfully. {result.failedItems.length} product
              {result.failedItems.length === 1 ? '' : 's'} need attention.
            </Message>
          </div>
        </HeaderBlock>

        <Divider />

        <div>
          <ProgressTrack>
            <ProgressFill $percent={percent} />
          </ProgressTrack>
          <ProgressLabels style={{ marginTop: 8 }}>
            <SuccessLabel>✓ {successCount} imported</SuccessLabel>
            <WarningLabel>⚠ {result.failedItems.length} need attention</WarningLabel>
          </ProgressLabels>
        </div>

        <AlertBox>
          <AlertIcon>
            <HelpCircleIcon />
          </AlertIcon>
          <AlertText>
            {result.failedItems.length} item{result.failedItems.length === 1 ? '' : 's'} were skipped due to
            unrecognized SKUs or missing details. Reviewing them lets you resolve or create them.
          </AlertText>
        </AlertBox>

        {showDetails && (
          <FailedItemsList>
            {result.failedItems.map((item:any) => (
              <FailedItemRow key={item.id}>
                <FailedItemName>{item.name}</FailedItemName>
                <FailedItemReason>{item.reason}</FailedItemReason>
              </FailedItemRow>
            ))}
          </FailedItemsList>
        )}

        <Actions>
          <Button type="button" onClick={onViewInventory}>
            View Inventory
          </Button>
          <Button type="button" $variant="secondary" onClick={handleReviewFailedItems}>
            {showDetails ? 'Hide Details' : 'Review Failed Items'}
          </Button>
        </Actions>
      </Card>
    </Wrapper>
  );
}

function AlertTriangleIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function HelpCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
