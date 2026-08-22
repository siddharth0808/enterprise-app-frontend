import { useState } from 'react';
import styled from 'styled-components';
import { Input } from '../Input/Input';

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const ToggleButton = styled.button`
  position: absolute;
  right: ${({ theme }) => theme.spacing(3)};
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textMuted};

  &:hover {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const StyledInput = styled(Input)`
  padding-right: ${({ theme }) => theme.spacing(9)};
`;

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export function PasswordInput({ hasError, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <Wrapper>
      <StyledInput type={visible ? 'text' : 'password'} $hasError={hasError} {...props} />
      <ToggleButton
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        tabIndex={-1}
      >
        {visible ? <EyeIcon /> : <EyeOffIcon />}
      </ToggleButton>
    </Wrapper>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.6 18.6 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
