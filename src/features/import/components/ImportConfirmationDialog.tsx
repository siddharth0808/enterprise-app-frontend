import styled from 'styled-components';
import { Button } from '../../../components/common/Button';

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
  max-width: 440px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.card};
  padding: ${({ theme }) => theme.spacing(7)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(5)};
`;

const Title = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.xl};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Message = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.base};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1.5)};
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding-left: ${({ theme }) => theme.spacing(5)};
  list-style: disc;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing(3)};
`;

interface ImportConfirmationDialogProps {
  totalUnits: number;
  totalProducts: number;
  onCancel: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

export function ImportConfirmationDialog({
  totalUnits,
  totalProducts,
  onCancel,
  onConfirm,
  isSubmitting,
}: ImportConfirmationDialogProps) {
  return (
    <Backdrop onClick={onCancel}>
      <Dialog onClick={(event) => event.stopPropagation()}>
        <Title>Confirm Inventory Import?</Title>
        <Message>
          This will add {totalUnits.toLocaleString()} units across {totalProducts} products.
        </Message>
        <List>
          <li>Existing products will have their stock increased.</li>
          <li>New products will be created and added to inventory.</li>
        </List>
        <Actions>
          <Button type="button" $variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="button" onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? 'Importing…' : 'Confirm Import'}
          </Button>
        </Actions>
      </Dialog>
    </Backdrop>
  );
}
