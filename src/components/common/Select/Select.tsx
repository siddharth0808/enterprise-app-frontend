import styled from 'styled-components';

interface SelectWrapperProps {
  $hasError?: boolean;
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledSelect = styled.select<SelectWrapperProps>`
  width: 100%;
  height: 40px;
  padding: 0 ${({ theme }) => theme.spacing(8)} 0 ${({ theme }) => theme.spacing(3)};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid
    ${({ theme, $hasError }) => ($hasError ? theme.colors.danger : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.font.size.base};
  color: ${({ theme }) => theme.colors.textPrimary};
  appearance: none;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primarySoft};
  }
`;

const Chevron = styled.svg`
  position: absolute;
  right: ${({ theme }) => theme.spacing(3)};
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: ${({ theme }) => theme.colors.textMuted};
`;

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export function Select({ hasError, options, placeholder, ...props }: SelectProps) {
  return (
    <Wrapper>
      <StyledSelect $hasError={hasError} {...props}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </StyledSelect>
      <Chevron width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round" />
      </Chevron>
    </Wrapper>
  );
}
