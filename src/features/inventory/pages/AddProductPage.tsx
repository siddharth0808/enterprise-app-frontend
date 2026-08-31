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
import type { Product } from "../types/product.types";
import { expiryDate, formatDate } from "../../../utils/formatters";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(6)};
  width: 100%;
`;

const initialValues: Product = {
  name: "",
  expiryDate: 0,
  batchNumber: "",
  category: "",
  manufacturer: "",
  mrp: 0,
  rate: 0,
  amount: 0,
  discount:0,
  sgst:0,
  cgst:0,
  hsn: 0,
  currentStock: 0,
  minimumStock: 0,
};

export default function AddProductPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isCreating = useAppSelector((state) => state.inventory.isCreating);
  const createError = useAppSelector((state) => state.inventory.createError);
  const [values, setValues] = useState<Product>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof Product, string>>
  >({});

  const handleChange =
    (field: keyof Product) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
      if (createError) dispatch(clearCreateError());
    };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const errors = validateFields(values, {
      name: (value) =>
        !isRequired(value) ? "Product Name is required." : undefined,
      mrp: (value) =>
        !isNonNegativeNumber(value)
          ? "Enter a valid selling price."
          : undefined,
      rate: (value) =>
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
        name: values.name,
        mrp: Number(values.mrp),
        rate: Number(values.rate),
        currentStock: Number(values.currentStock),
        minimumStock: Number(values.minimumStock),
        expiryDate: formatDate(values.expiryDate),
        manufacturer: values.manufacturer || '',
        batchNumber: values.batchNumber || '',
        hsn: Number(values.hsn) || 0,
        amount: Number(values.amount) || 0,
        discount: Number(values.discount) || 0,
        sgst: Number(values.sgst) || 0,
        cgst: Number(values.cgst) || 0,
        status: 'NEW'
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
              placeholder="name"
              value={values.name}
              onChange={handleChange("name")}
              $hasError={!!fieldErrors.name}
            />
          </FormField>

          <FieldRow>
            <FormField label="MRP." htmlFor="mrp" error={fieldErrors.mrp}>
              <Input
                id="mrp"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={values.mrp}
                onChange={handleChange("mrp")}
                $hasError={!!fieldErrors.mrp}
              />
            </FormField>
            <FormField label="Rate" htmlFor="rate" error={fieldErrors.rate}>
              <Input
                id="rate"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={values.rate}
                onChange={handleChange("rate")}
                $hasError={!!fieldErrors.rate}
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

            <FormField
              label="Expriy Date"
              htmlFor="expiryDate"
              error={fieldErrors.expiryDate}
            >
              <Input
                id="expiryDate"
                type="date"
                value={values.expiryDate}
                onChange={handleChange("expiryDate")}
                $hasError={!!fieldErrors.expiryDate}
              />
            </FormField>
        </FieldStack>

        <Divider>Optional Details</Divider>

        <FieldStack>
          <FormField label="Manufacturer" htmlFor="manufacturer">
            <Input
              id="manufacturer"
              placeholder="ABC Pvt. Ltd."
              value={values.manufacturer}
              onChange={handleChange("manufacturer")}
            />
          </FormField>
          <FieldRow>
            <FormField label="Batch No." htmlFor="batchNumber">
              <Input
                id="batchNumber"
                placeholder="WMK-2024-BLK"
                value={values.batchNumber}
                onChange={handleChange("batchNumber")}
              />
            </FormField>
            <FormField label="HSN" htmlFor="hsn">
              <Input
                id="hsn"
                placeholder="30000979"
                value={values.hsn}
                onChange={handleChange("hsn")}
              />
            </FormField>
          </FieldRow>

          <FieldRow>
            <FormField label="Total Amt." htmlFor="amount">
              <Input
                id="amount"
                placeholder="0.00"
                value={values.amount}
                onChange={handleChange("amount")}
              />
            </FormField>
            <FormField label="Discount" htmlFor="discount">
              <Input
                id="discount"
                placeholder="0.00"
                value={values.discount}
                onChange={handleChange("discount")}
              />
            </FormField>
          </FieldRow>
          <FieldRow>
            <FormField label="SGST" htmlFor="sgst">
              <Input
                id="sgst"
                placeholder="0.00"
                value={values.sgst}
                onChange={handleChange("sgst")}
              />
            </FormField>
            <FormField label="CGST" htmlFor="cgst">
              <Input
                id="cgst"
                placeholder="0.00"
                value={values.cgst}
                onChange={handleChange("cgst")}
              />
            </FormField>
          </FieldRow>
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
