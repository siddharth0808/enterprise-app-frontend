import styled from 'styled-components';
import { Button } from '../Button/Button';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(10)} ${({ theme }) => theme.spacing(6)};
  width: 100%;
`;

const IconBadge = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.dangerSoft};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.danger};
`;

const Message = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.font.size.base};
  max-width: 360px;
`;

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Wrapper>
      <IconBadge>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </IconBadge>
      <Message>{message}</Message>
      {onRetry && (
        <Button type="button" $variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </Wrapper>
  );
}
