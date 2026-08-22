import { useRef } from 'react';
import styled from 'styled-components';

const Row = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2.5)};
  justify-content: center;
`;

const Digit = styled.input`
  width: 48px;
  height: 48px;
  text-align: center;
  font-size: ${({ theme }) => theme.font.size.xxl};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primarySoft};
  }
`;

const CODE_LENGTH = 6;

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function CodeInput({ value, onChange, disabled }: CodeInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const digits = value.split('').concat(Array(CODE_LENGTH).fill('')).slice(0, CODE_LENGTH);

  const setDigit = (index: number, digit: string) => {
    const nextDigits = [...digits];
    nextDigits[index] = digit;
    onChange(nextDigits.join('').replace(/\s/g, ''));
  };

  const handleChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value.replace(/\D/g, '');
    if (!raw) {
      setDigit(index, '');
      return;
    }
    // Handle paste of the full code into any box.
    if (raw.length > 1) {
      onChange(raw.slice(0, CODE_LENGTH));
      inputsRef.current[Math.min(raw.length, CODE_LENGTH) - 1]?.focus();
      return;
    }
    setDigit(index, raw);
    if (index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number) => (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <Row role="group" aria-label="Confirmation code">
      {digits.map((digit, index) => (
        <Digit
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          inputMode="numeric"
          maxLength={CODE_LENGTH}
          value={digit}
          onChange={handleChange(index)}
          onKeyDown={handleKeyDown(index)}
          disabled={disabled}
        />
      ))}
    </Row>
  );
}
