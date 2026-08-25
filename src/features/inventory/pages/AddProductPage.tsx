import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Input } from "../../../components/common/Input";
import { Button } from "../../../components/common/Button";
import { FormField } from "../../../components/common/FormField";
import { PageHeader } from "../../../components/layout/PageHeader";
import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import { clearCreateError, createProduct } from "../store/inventorySlice";
import {
  isNonNegativeNumber,
  isRequired,
  validateFields,
} from "../../../utils/validation";
import { FormError } from "../../auth/components/AuthCard.styles";
import {
  Divider,
  FieldRow,
  FieldStack,
  FormActions,
  FormCard,
} from "../../business/components/FormLayout.styles";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(6)};
  width: 100%;
`;

interface FormValues {
  name: string;
  sku: string;
  category: string;
  brand: string;
  sellingPrice: string;
  costPrice: string;
  currentStock: string;
  minimumStock: string;
}

const initialValues: FormValues = {
  name: "",
  sku: "",
  category: "",
  brand: "",
  sellingPrice: "",
  costPrice: "",
  currentStock: "",
  minimumStock: "",
};

export default function AddProductPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isCreating = useAppSelector((state) => state.inventory.isCreating);
  const createError = useAppSelector((state) => state.inventory.createError);
  const business = useAppSelector((state) => state.business.business);
  const businessId = business.length > 0 ? business[0].id : "";
  const [values, setValues] = useState<FormValues>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof FormValues, string>>
  >({});

  const handleChange =
    (field: keyof FormValues) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
      if (createError) dispatch(clearCreateError());
    };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const errors = validateFields(values, {
      name: (value) =>
        !isRequired(value) ? "Product Name is required." : undefined,
      sellingPrice: (value) =>
        !isNonNegativeNumber(value)
          ? "Enter a valid selling price."
          : undefined,
      costPrice: (value) =>
        !isNonNegativeNumber(value) ? "Enter a valid cost price." : undefined,
      currentStock: (value) =>
        !isNonNegativeNumber(value)
          ? "Enter a valid current stock."
          : undefined,
      minimumStock: (value) =>
        !isNonNegativeNumber(value)
          ? "Enter a valid minimum stock."
          : undefined,
    });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (isCreating) return;

    const result = await dispatch(
      createProduct({
        businessId,
        name: values.name,
        sku: values.sku || undefined,
        category: values.category || undefined,
        brand: values.brand || undefined,
        sellingPrice: Number(values.sellingPrice),
        costPrice: Number(values.costPrice),
        currentStock: Number(values.currentStock),
        minimumStock: Number(values.minimumStock),
      }),
    );
    if (createProduct.fulfilled.match(result)) {
      navigate("/inventory", { replace: true });
    }
  };

  return (
    <Content>
      <PageHeader
        title="Add Product"
        subtitle="Add a new item to your inventory catalog"
        onBack={() => navigate("/inventory")}
      />

      <FormCard onSubmit={handleSubmit} noValidate>
        {createError && <FormError role="alert">{createError}</FormError>}

        <FieldStack>
          <FormField
            label="Product Name"
            htmlFor="name"
            error={fieldErrors.name}
          >
            <Input
              id="name"
              placeholder="Wireless Mechanical Keyboard"
              value={values.name}
              onChange={handleChange("name")}
              $hasError={!!fieldErrors.name}
            />
          </FormField>

          <FieldRow>
            <FormField
              label="Selling Price"
              htmlFor="sellingPrice"
              error={fieldErrors.sellingPrice}
            >
              <Input
                id="sellingPrice"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={values.sellingPrice}
                onChange={handleChange("sellingPrice")}
                $hasError={!!fieldErrors.sellingPrice}
              />
            </FormField>
            <FormField
              label="Cost Price"
              htmlFor="costPrice"
              error={fieldErrors.costPrice}
            >
              <Input
                id="costPrice"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={values.costPrice}
                onChange={handleChange("costPrice")}
                $hasError={!!fieldErrors.costPrice}
              />
            </FormField>
          </FieldRow>

          <FieldRow>
            <FormField
              label="Current Stock"
              htmlFor="currentStock"
              error={fieldErrors.currentStock}
            >
              <Input
                id="currentStock"
                type="number"
                min="0"
                step="1"
                placeholder="0"
                value={values.currentStock}
                onChange={handleChange("currentStock")}
                $hasError={!!fieldErrors.currentStock}
              />
            </FormField>
            <FormField
              label="Minimum Stock"
              htmlFor="minimumStock"
              error={fieldErrors.minimumStock}
            >
              <Input
                id="minimumStock"
                type="number"
                min="0"
                step="1"
                placeholder="0"
                value={values.minimumStock}
                onChange={handleChange("minimumStock")}
                $hasError={!!fieldErrors.minimumStock}
              />
            </FormField>
          </FieldRow>
        </FieldStack>

        <Divider>Optional Details</Divider>

        <FieldStack>
          <FieldRow>
            <FormField label="SKU" htmlFor="sku">
              <Input
                id="sku"
                placeholder="WMK-2024-BLK"
                value={values.sku}
                onChange={handleChange("sku")}
              />
            </FormField>
            <FormField label="Category" htmlFor="category">
              <Input
                id="category"
                placeholder="Electronics"
                value={values.category}
                onChange={handleChange("category")}
              />
            </FormField>
          </FieldRow>
          <FormField label="Brand" htmlFor="brand">
            <Input
              id="brand"
              placeholder="Logitech"
              value={values.brand}
              onChange={handleChange("brand")}
            />
          </FormField>
        </FieldStack>

        <FormActions>
          <Button
            type="button"
            $variant="secondary"
            onClick={() => navigate("/inventory")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating}>
            {isCreating ? "Adding…" : "Add Product"}
          </Button>
        </FormActions>
      </FormCard>
    </Content>
  );
}
