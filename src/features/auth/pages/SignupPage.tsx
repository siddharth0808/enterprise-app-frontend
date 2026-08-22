import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, PageContainer } from '../../../components/common/PageContainer';
import { Logo } from '../../../components/layout/Logo';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { PasswordInput } from '../../../components/common/PasswordInput';
import { FormField } from '../../../components/common/FormField';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { clearAuthError, signup } from '../store/authSlice';
import { isRequired, isValidEmail, validateFields } from '../../../utils/validation';
import {
  Actions,
  AuthHeader,
  AuthSubtitle,
  AuthTitle,
  AuthTitleBlock,
  Form,
  FormError,
  InlineLink,
  LinksRow,
} from '../components/AuthCard.styles';

interface FormValues {
  fullName:string
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isSubmitting = useAppSelector((state) => state.auth.isSubmitting);
  const authError = useAppSelector((state) => state.auth.error);

  const [values, setValues] = useState<FormValues>({
    fullName:'',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormValues, string>>>({});

  const handleChange = (field: keyof FormValues) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
    if (authError) dispatch(clearAuthError());
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const errors = validateFields(values, {
      email: (value) => {
        if (!isRequired(value)) return 'Email is required.';
        if (!isValidEmail(value)) return 'Enter a valid email address.';
        return undefined;
      },
      password: (value) => {
        if (!isRequired(value)) return 'Password is required.';
        if (value.length < 8) return 'Password must be at least 8 characters.';
        return undefined;
      },
      confirmPassword: (value, allValues) => {
        if (!isRequired(value)) return 'Confirm Password is required.';
        if (value !== allValues.password) return 'Passwords do not match.';
        return undefined;
      },
    });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (isSubmitting) return; // Prevent duplicate submissions.

    const result = await dispatch(signup({ fullName:values.fullName, email: values.email, password: values.password }));
    if (signup.fulfilled.match(result)) {
      // Pass the email via route state (not query params/persistent
      // storage) so EmailVerificationPage can display it and never send
      // the password anywhere further.
      navigate('/verify-email', { state: { email: values.email } });
    }
  };

  return (
    <PageContainer>
      <Card as="form" onSubmit={handleSubmit} noValidate>
        <AuthHeader>
          <Logo />
          <AuthTitleBlock>
            <AuthTitle>Create your account</AuthTitle>
            <AuthSubtitle>Start managing your business inventory</AuthSubtitle>
          </AuthTitleBlock>
        </AuthHeader>

        {authError && <FormError role="alert">{authError}</FormError>}

        <Form as="div">
          <FormField label="Full Name" htmlFor="fullName" error={fieldErrors.fullName}>
            <Input
              id="fullName"
              type="fullName"
              autoComplete="fullName"
              placeholder="Jhone Doe"
              value={values.fullName}
              onChange={handleChange('fullName')}
              $hasError={!!fieldErrors.fullName}
            />
          </FormField>
          <FormField label="Email Address" htmlFor="email" error={fieldErrors.email}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@business.com"
              value={values.email}
              onChange={handleChange('email')}
              $hasError={!!fieldErrors.email}
            />
          </FormField>
          <FormField label="Password" htmlFor="password" error={fieldErrors.password}>
            <PasswordInput
              id="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={values.password}
              onChange={handleChange('password')}
              hasError={!!fieldErrors.password}
            />
          </FormField>
          <FormField
            label="Confirm Password"
            htmlFor="confirmPassword"
            error={fieldErrors.confirmPassword}
          >
            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={values.confirmPassword}
              onChange={handleChange('confirmPassword')}
              hasError={!!fieldErrors.confirmPassword}
            />
          </FormField>
        </Form>

        <Actions>
          <Button type="submit" $fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Creating account…' : 'Sign Up'}
          </Button>
          <LinksRow>
            <span>Already have an account?</span>
            <InlineLink type="button" onClick={() => navigate('/login')}>
              Log In
            </InlineLink>
          </LinksRow>
        </Actions>
      </Card>
    </PageContainer>
  );
}
