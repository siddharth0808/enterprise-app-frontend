import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { FormField } from '../../../components/common/FormField';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Loader } from '../../../components/common/Loader';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { clearUpdateError, fetchProductById, fetchProducts, updateProduct } from '../store/inventorySlice';
import { isNonNegativeNumber, isRequired, validateFields } from '../../../utils/validation';
import { FormError } from '../../auth/components/AuthCard.styles';
import { Divider, FieldRow, FieldStack, FormActions, FormCard } from '../../business/components/FormLayout.styles';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(6)};
  width: 100%;
`;

const ReadOnlyHint = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

interface FormValues {
  name: string;
  sku: string;
  category: string;
  brand: string;
  sellingPrice: string;
  costPrice: string;
  minimumStock: string;
}

export default function EditProductPage() {
  const { productId = '' } = useParams<{ productId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const product = useAppSelector((state) => state.inventory.products.find((item) => item.id === productId));
  const listStatus = useAppSelector((state) => state.inventory.status);
  const isUpdating = useAppSelector((state) => state.inventory.isUpdating);
  const updateError = useAppSelector((state) => state.inventory.updateError);

  const business = useAppSelector((state) => state.business.business);
  const businessId = business.length > 0 ? business[0].id : "";

  useEffect(() => {
    if (!product && listStatus === 'idle') {
      dispatch(fetchProducts(businessId));
    } else if (!product && listStatus !== 'loading') {
      dispatch(fetchProductById(productId));
    }
  }, [product, listStatus, productId, dispatch]);

  const [values, setValues] = useState<FormValues>(() => ({
    name: product?.name ?? '',
    sku: product?.sku ?? '',
    category: product?.category ?? '',
    brand: product?.brand ?? '',
    sellingPrice: product ? String(product.sellingPrice) : '',
    costPrice: product ? String(product.costPrice) : '',
    minimumStock: product ? String(product.minimumStock) : '',
  }));
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormValues, string>>>({});

  // Hydrate once the product is available (e.g. after a fetch on refresh).
  const hasHydrated = product !== undefined;
  useEffect(() => {
    if (product) {
      setValues({
        name: product.name,
        sku: product.sku ?? '',
        category: product.category ?? '',
        brand: product.brand ?? '',
        sellingPrice: String(product.sellingPrice),
        costPrice: String(product.costPrice),
        minimumStock: String(product.minimumStock),
      });
    }
    // Only re-hydrate when the product transitions from unloaded to loaded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated]);

  const handleChange = (field: keyof FormValues) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
    if (updateError) dispatch(clearUpdateError());
  };

  if (!product) {
    return <Loader label="Loading product…" />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const errors = validateFields(values, {
      name: (value) => (!isRequired(value) ? 'Product Name is required.' : undefined),
      sellingPrice: (value) => (!isNonNegativeNumber(value) ? 'Enter a valid selling price.' : undefined),
      costPrice: (value) => (!isNonNegativeNumber(value) ? 'Enter a valid cost price.' : undefined),
      minimumStock: (value) => (!isNonNegativeNumber(value) ? 'Enter a valid minimum stock.' : undefined),
    });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (isUpdating) return;

    const result = await dispatch(
      updateProduct({
        productId: product.id,
        payload: {
          name: values.name,
          sku: values.sku || undefined,
          category: values.category || undefined,
          brand: values.brand || undefined,
          sellingPrice: Number(values.sellingPrice),
          costPrice: Number(values.costPrice),
          minimumStock: Number(values.minimumStock),
        },
      })
    );
    if (updateProduct.fulfilled.match(result)) {
      navigate(`/products/${product.id}`, { replace: true });
    }
  };

  return (
    <Content>
      <PageHeader
        title="Edit Product"
        subtitle={`Modify details of ${product.name}`}
        onBack={() => navigate(`/products/${product.id}`)}
      />

      <FormCard onSubmit={handleSubmit} noValidate>
        {updateError && <FormError role="alert">{updateError}</FormError>}

        <FieldStack>
          <FormField label="Product Name" htmlFor="name" error={fieldErrors.name}>
            <Input
              id="name"
              value={values.name}
              onChange={handleChange('name')}
              $hasError={!!fieldErrors.name}
            />
          </FormField>

          <FieldRow>
            <FormField label="Selling Price ($)" htmlFor="sellingPrice" error={fieldErrors.sellingPrice}>
              <Input
                id="sellingPrice"
                type="number"
                min="0"
                step="0.01"
                value={values.sellingPrice}
                onChange={handleChange('sellingPrice')}
                $hasError={!!fieldErrors.sellingPrice}
              />
            </FormField>
            <FormField label="Cost Price ($)" htmlFor="costPrice" error={fieldErrors.costPrice}>
              <Input
                id="costPrice"
                type="number"
                min="0"
                step="0.01"
                value={values.costPrice}
                onChange={handleChange('costPrice')}
                $hasError={!!fieldErrors.costPrice}
              />
            </FormField>
          </FieldRow>

          <FieldRow>
            <FormField label="Current Stock (Read Only)" htmlFor="currentStock">
              <Input id="currentStock" value={product.currentStock} disabled readOnly />
              <ReadOnlyHint>Stock can only be changed via Adjust Stock.</ReadOnlyHint>
            </FormField>
            <FormField label="Minimum Stock Level" htmlFor="minimumStock" error={fieldErrors.minimumStock}>
              <Input
                id="minimumStock"
                type="number"
                min="0"
                step="1"
                value={values.minimumStock}
                onChange={handleChange('minimumStock')}
                $hasError={!!fieldErrors.minimumStock}
              />
            </FormField>
          </FieldRow>
        </FieldStack>

        <Divider>Optional Details</Divider>

        <FieldStack>
          <FieldRow>
            <FormField label="SKU / Barcode" htmlFor="sku">
              <Input id="sku" value={values.sku} onChange={handleChange('sku')} />
            </FormField>
            <FormField label="Category" htmlFor="category">
              <Input id="category" value={values.category} onChange={handleChange('category')} />
            </FormField>
          </FieldRow>
          <FormField label="Brand" htmlFor="brand">
            <Input id="brand" value={values.brand} onChange={handleChange('brand')} />
          </FormField>
        </FieldStack>

        <FormActions>
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? 'Saving…' : 'Save Changes'}
          </Button>
          <Button type="button" $variant="ghost" onClick={() => navigate(`/products/${product.id}`)}>
            Cancel
          </Button>
        </FormActions>
      </FormCard>
    </Content>
  );
}
