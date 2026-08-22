import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "../../../components/common/PageContainer";
import { Input } from "../../../components/common/Input";
import { Select } from "../../../components/common/Select";
import { Button } from "../../../components/common/Button";
import { FormField } from "../../../components/common/FormField";
import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import { clearBusinessError, createBusiness } from "../store/businessSlice";
import { BUSINESS_TYPE_OPTIONS } from "../types/business.types";
import {
  isRequired,
  isValidEmail,
  isValidPhone,
  validateFields,
} from "../../../utils/validation";
import { FormError } from "../../auth/components/AuthCard.styles";
import {
  Divider,
  FieldStack,
  FormActions,
  FormCard,
  SectionTitle,
} from "../components/FormLayout.styles";
import styled from "styled-components";

const Title = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.xxl};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

interface FormValues {
  name: string;
  businessType: string;
  phone: string;
  email: string;
  address: string;
}

const businessTypeOptions = BUSINESS_TYPE_OPTIONS.map((type) => ({
  value: type,
  label: type,
}));

export default function BusinessSetupPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const listBusiness = useAppSelector((state) => state.business.business);
  const isSubmitting = useAppSelector((state) => state.business.isSubmitting);
  const businessError = useAppSelector((state) => state.business.error);
  const ownerName = useAppSelector((state) => state.auth.user?.fullName) ?? "";

  // Users who already completed setup shouldn't be able to re-submit this
  // form; send them straight to Inventory.
  useEffect(() => {
    if (listBusiness.length > 0) {
      navigate("/inventory", { replace: true });
    }
  }, [listBusiness, navigate]);

  const [values, setValues] = useState<FormValues>({
    name: "",
    businessType: "",
    phone: "",
    email: "",
    address: "",
  });
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof FormValues, string>>
  >({});

  const handleChange =
    (field: keyof FormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
      if (businessError) dispatch(clearBusinessError());
    };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const errors = validateFields(values, {
      name: (value) =>
        !isRequired(value) ? "Business Name is required." : undefined,
      businessType: (value) =>
        !isRequired(value) ? "Business Type is required." : undefined,
      email: (value) =>
        value && !isValidEmail(value)
          ? "Enter a valid business email."
          : undefined,
      phone: (value) =>
        value && !isValidPhone(value)
          ? "Enter a valid phone number."
          : undefined,
    });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (isSubmitting) return;

    const result = await dispatch(
      createBusiness({
        ownerName,
        name: values.name,
        businessType: values.businessType,
        phone: values.phone || undefined,
        email: values.email || undefined,
        address: values.address || undefined,
      }),
    );
    if (createBusiness.fulfilled.match(result)) {
      navigate("/inventory", { replace: true });
    }
  };

  return (
    <PageContainer>
      <FormCard onSubmit={handleSubmit} noValidate>
        <SectionTitle>
          <Title>Set up your business</Title>
          <Subtitle>
            Tell us about your business to get started with InventoryFlow
          </Subtitle>
        </SectionTitle>

        {businessError && <FormError role="alert">{businessError}</FormError>}

        <FieldStack>
          <FormField
            label="Business Name"
            htmlFor="name"
            error={fieldErrors.name}
          >
            <Input
              id="name"
              placeholder="Apex Electronics Inc."
              value={values.name}
              onChange={handleChange("name")}
              $hasError={!!fieldErrors.name}
            />
          </FormField>
          <FormField
            label="Business Type"
            htmlFor="businessType"
            error={fieldErrors.businessType}
          >
            <Select
              id="businessType"
              placeholder="Select a business type"
              options={businessTypeOptions}
              value={values.businessType}
              onChange={handleChange("businessType")}
              hasError={!!fieldErrors.businessType}
            />
          </FormField>
        </FieldStack>

        <Divider>Optional Details</Divider>

        <FieldStack>
          <FormField
            label="Phone Number"
            htmlFor="phone"
            error={fieldErrors.phone}
          >
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 019-2834"
              value={values.phone}
              onChange={handleChange("phone")}
              $hasError={!!fieldErrors.phone}
            />
          </FormField>
          <FormField
            label="Business Email"
            htmlFor="businessEmail"
            error={fieldErrors.email}
          >
            <Input
              id="businessEmail"
              type="email"
              placeholder="billing@yourbusiness.com"
              value={values.email}
              onChange={handleChange("email")}
              $hasError={!!fieldErrors.email}
            />
          </FormField>
          <FormField label="Address" htmlFor="address">
            <Input
              id="address"
              placeholder="102 Innovation Drive, Ste 400, CA"
              value={values.address}
              onChange={handleChange("address")}
            />
          </FormField>
        </FieldStack>

        <FormActions>
          <Button type="submit" $fullWidth disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save & Continue"}
          </Button>
        </FormActions>
      </FormCard>
    </PageContainer>
  );
}
