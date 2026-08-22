import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Card, PageContainer } from '../../../components/common/PageContainer';
import { Button } from '../../../components/common/Button';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { clearAuthError, confirmSignup, resendConfirmationCode } from '../store/authSlice';
import { CodeInput } from '../components/CodeInput';
import {
  Actions,
  AuthHeader,
  AuthSubtitle,
  AuthTitle,
  AuthTitleBlock,
  FormError,
  InlineLink,
  LinksRow,
} from '../components/AuthCard.styles';

const IconBadge = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primarySoft};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
`;

const Hint = styled.p`
  text-align: center;
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
`;

const ResendSuccess = styled.p`
  text-align: center;
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
`;

interface LocationState {
  email?: string;
}

export default function EmailVerificationPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as LocationState | null)?.email ?? '';

  const isSubmitting = useAppSelector((state) => state.auth.isSubmitting);
  const authError = useAppSelector((state) => state.auth.error);

  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<string | undefined>();
  const [resendState, setResendState] = useState<'idle' | 'loading' | 'sent'>('idle');

  const handleCodeChange = (value: string) => {
    setCode(value);
    setCodeError(undefined);
    if (authError) dispatch(clearAuthError());
  };

  const handleVerify = async () => {
    if (code.length !== 6) {
      setCodeError('Enter the full 6-digit code.');
      return;
    }
    if (isSubmitting) return;

    const result = await dispatch(confirmSignup({ email, code }));
    if (confirmSignup.fulfilled.match(result)) {
      navigate('/login', { replace: true });
    }
  };

  const handleResend = async () => {
    setResendState('loading');
    const result = await dispatch(resendConfirmationCode(email));
    setResendState(resendConfirmationCode.fulfilled.match(result) ? 'sent' : 'idle');
  };

  return (
    <PageContainer>
      <Card>
        <AuthHeader>
          <IconBadge>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="m22 6-10 7L2 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </IconBadge>
          <AuthTitleBlock>
            <AuthTitle>Verify your email</AuthTitle>
            <AuthSubtitle>
              {email ? `We sent a code to ${email}` : 'Enter the code we sent to your email'}
            </AuthSubtitle>
          </AuthTitleBlock>
        </AuthHeader>

        {authError && <FormError role="alert">{authError}</FormError>}

        <div>
          <CodeInput value={code} onChange={handleCodeChange} disabled={isSubmitting} />
          {codeError && (
            <Hint role="alert" style={{ color: '#dc2626', marginTop: 8 }}>
              {codeError}
            </Hint>
          )}
          <Hint style={{ marginTop: 12 }}>Didn&apos;t get it? Check your spam folder.</Hint>
        </div>

        <Actions>
          <Button type="button" $fullWidth disabled={isSubmitting} onClick={handleVerify}>
            {isSubmitting ? 'Verifying…' : 'Verify'}
          </Button>
          {resendState === 'sent' ? (
            <ResendSuccess>A new code has been sent.</ResendSuccess>
          ) : (
            <LinksRow>
              <span>Didn&apos;t receive a code?</span>
              <InlineLink type="button" onClick={handleResend} disabled={resendState === 'loading'}>
                {resendState === 'loading' ? 'Resending…' : 'Resend code'}
              </InlineLink>
            </LinksRow>
          )}
        </Actions>
      </Card>
    </PageContainer>
  );
}
