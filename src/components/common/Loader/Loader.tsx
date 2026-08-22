import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Spinner = styled.div<{ $size: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  border: 3px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.primary};
  animation: ${spin} 0.7s linear infinite;
`;

const Center = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(10)};
  width: 100%;
`;

const Label = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.font.size.sm};
`;

interface LoaderProps {
  size?: number;
  label?: string;
  fullPage?: boolean;
}

export function Loader({ size = 32, label, fullPage }: LoaderProps) {
  return (
    <Center style={fullPage ? { minHeight: '100vh' } : undefined}>
      <Spinner $size={size} role="status" aria-label={label ?? 'Loading'} />
      {label && <Label>{label}</Label>}
    </Center>
  );
}
