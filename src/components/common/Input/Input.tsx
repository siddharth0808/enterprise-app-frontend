import styled from 'styled-components';

interface StyledInputProps {
  $hasError?: boolean;
}

export const Input = styled.input<StyledInputProps>`
  width: 100%;
  height: 40px;
  padding: 0 ${({ theme }) => theme.spacing(3)};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid
    ${({ theme, $hasError }) => ($hasError ? theme.colors.danger : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.font.size.base};
  color: ${({ theme }) => theme.colors.textPrimary};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primarySoft};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.background};
    cursor: not-allowed;
  }
`;

export const TextArea = styled.textarea<StyledInputProps>`
  width: 100%;
  min-height: 96px;
  padding: ${({ theme }) => theme.spacing(3)};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid
    ${({ theme, $hasError }) => ($hasError ? theme.colors.danger : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.font.size.base};
  color: ${({ theme }) => theme.colors.textPrimary};
  resize: vertical;
  font-family: inherit;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primarySoft};
  }
`;
