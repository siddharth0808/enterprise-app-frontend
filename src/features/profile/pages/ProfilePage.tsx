import { useEffect, useRef, useState, type FormEvent } from 'react';
import styled from 'styled-components';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { Button } from '../../../components/common/Button';
import { FormField } from '../../../components/common/FormField';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Loader } from '../../../components/common/Loader';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { clearBusinessError, updateBusiness } from '../../business/store/businessSlice';
import { BUSINESS_TYPE_OPTIONS, type Business } from '../../business/types/business.types';
import { isRequired, isValidEmail, isValidPhone, validateFields } from '../../../utils/validation';
import { FormError } from '../../auth/components/AuthCard.styles';
import { FieldRow, FieldStack, FormActions, FormCard, SectionTitle } from '../../business/components/FormLayout.styles';
import { AccountInfoCard } from '../components/AccountInfoCard';
import type { ProfileFormValues } from '../profile.types';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};
  width: 100%;
  max-width: 640px;
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CardSubtitle = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SavedNotice = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.primary};
`;

const businessTypeOptions = BUSINESS_TYPE_OPTIONS.map((type) => ({ value: type, label: type }));

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const business = useAppSelector((state) => state.business.business);
  const isSubmitting = useAppSelector((state) => state.business.isSubmitting);
  const businessError = useAppSelector((state) => state.business.error);

  const singleBusiness:Business | any =  business.length > 0 ? business[0] :  {} 
  const [values, setValues] = useState<ProfileFormValues>(() => ({
    name: singleBusiness?.businessName ?? '',
    businessType: singleBusiness?.businessType ?? '',
    phone: singleBusiness?.mobile ?? '',
    email: singleBusiness?.email ?? '',
    address: singleBusiness?.businessAddress ?? '',
  }));
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ProfileFormValues, string>>>({});
  const [justSaved, setJustSaved] = useState(false);

  // Re-hydrate the form only when we load a *different* business record
  // (e.g. after the initial fetch resolves), not on every render.
  const hydratedBusinessId = useRef<string | null>(null);
  useEffect(() => {
    if (singleBusiness && hydratedBusinessId.current !== singleBusiness.id) {
      hydratedBusinessId.current = singleBusiness.id;
      setValues({
        name: singleBusiness.name,
        businessType:singleBusiness.businessType,
        phone:singleBusiness.mobile ?? '',
        email:singleBusiness.email ?? '',
        address:singleBusiness.businessAddress ?? '',
      });
    }
  }, [business]);

  const handleChange =
    (field: keyof ProfileFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
      setJustSaved(false);
      if (businessError) dispatch(clearBusinessError());
    };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const errors = validateFields(values, {
      name: (value) => (!isRequired(value) ? 'Business Name is required.' : undefined),
      businessType: (value) => (!isRequired(value) ? 'Business Type is required.' : undefined),
      email: (value) => (value && !isValidEmail(value) ? 'Enter a valid business email.' : undefined),
      phone: (value) => (value && !isValidPhone(value) ? 'Enter a valid phone number.' : undefined),
    });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (isSubmitting) return;

    const result = await dispatch(
      updateBusiness({
        name: values.name,
        businessType: values.businessType,
        phone: values.phone || undefined,
        email: values.email || undefined,
        address: values.address || undefined,
      })
    );
    if (updateBusiness.fulfilled.match(result)) {
      setJustSaved(true);
    }
  };

  if (!business) {
    return <Loader label="Loading profile…" />;
  }

  return (
    <Content>
      <PageHeader title="Profile" subtitle="Manage your account and business information" />

      {user && <AccountInfoCard email={user.email} />}

      <FormCard onSubmit={handleSubmit} noValidate>
        <SectionTitle>
          <CardTitle>Business Information</CardTitle>
          <CardSubtitle>Update details about your business</CardSubtitle>
        </SectionTitle>

        {businessError && <FormError role="alert">{businessError}</FormError>}

        <FieldStack>
          <FormField label="Business Name" htmlFor="name" error={fieldErrors.name}>
            <Input
              id="name"
              value={values.name}
              onChange={handleChange('name')}
              $hasError={!!fieldErrors.name}
            />
          </FormField>
          <FormField label="Business Type" htmlFor="businessType" error={fieldErrors.businessType}>
            <Select
              id="businessType"
              options={businessTypeOptions}
              value={values.businessType}
              onChange={handleChange('businessType')}
              hasError={!!fieldErrors.businessType}
            />
          </FormField>
          <FieldRow>
            <FormField label="Phone Number" htmlFor="phone" error={fieldErrors.phone}>
              <Input
                id="phone"
                type="tel"
                value={values.phone}
                onChange={handleChange('phone')}
                $hasError={!!fieldErrors.phone}
              />
            </FormField>
            <FormField label="Business Email" htmlFor="businessEmail" error={fieldErrors.email}>
              <Input
                id="businessEmail"
                type="email"
                value={values.email}
                onChange={handleChange('email')}
                $hasError={!!fieldErrors.email}
              />
            </FormField>
          </FieldRow>
          <FormField label="Address" htmlFor="address">
            <Input id="address" value={values.address} onChange={handleChange('address')} />
          </FormField>
        </FieldStack>

        <FormActions>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save Changes'}
          </Button>
          {justSaved && <SavedNotice>Saved.</SavedNotice>}
        </FormActions>
      </FormCard>
    </Content>
  );
}
