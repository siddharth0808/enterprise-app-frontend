import styled from 'styled-components';

const Banner = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1.5)};
  background: ${({ theme }) => theme.colors.warningSoft};
  border: 1px solid ${({ theme }) => theme.colors.warning}33;
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(4)};
`;

const WarningLine = styled.p`
  margin: 0;
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing(2)};
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.warning};
`;

interface ImportWarningProps {
  warnings: string[];
}

export function ImportWarning({ warnings }: ImportWarningProps) {
  if (warnings.length === 0) return null;

  return (
    <Banner role="alert">
      {warnings.map((warning) => (
        <WarningLine key={warning}>
          <span aria-hidden="true">⚠</span>
          <span>{warning}</span>
        </WarningLine>
      ))}
    </Banner>
  );
}
