import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const Mark = styled.div`
  width: 28px;
  height: 28px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textOnPrimary};
  flex-shrink: 0;
`;

const Wordmark = styled.p`
  font-size: ${({ theme }) => theme.font.size.xl};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;

  span {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export function Logo() {
  return (
    <Wrapper>
      <Mark>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      </Mark>
      <Wordmark>
        Inventory<span>Flow</span>
      </Wordmark>
    </Wrapper>
  );
}
