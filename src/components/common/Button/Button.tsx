import styled, { css } from 'styled-components';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps {
  $variant?: ButtonVariant;
  $fullWidth?: boolean;
}

const variantStyles = {
  primary: css`
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.textOnPrimary};
    border: 1px solid transparent;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primaryHover};
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.textSecondary};
    border: 1px solid ${({ theme }) => theme.colors.border};

    &:hover:not(:disabled) {
      border-color: ${({ theme }) => theme.colors.borderStrong};
    }
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.danger};
    color: ${({ theme }) => theme.colors.textOnPrimary};
    border: 1px solid transparent;

    &:hover:not(:disabled) {
      opacity: 0.9;
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.textSecondary};
    border: 1px solid transparent;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.background};
    }
  `,
};

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(2)};
  height: 40px;
  padding: 0 ${({ theme }) => theme.spacing(4)};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.font.size.base};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  white-space: nowrap;
  transition: background-color 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  ${({ $variant = 'primary' }) => variantStyles[$variant]}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
