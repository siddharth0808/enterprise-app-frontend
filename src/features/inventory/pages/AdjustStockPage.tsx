import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Input, TextArea } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { FormField } from '../../../components/common/FormField';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Loader } from '../../../components/common/Loader';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { fetchProductById, fetchProducts } from '../store/inventorySlice';
import { clearAdjustError, createTransaction } from '../store/transactionSlice';
import { AdjustmentTypeSelector } from '../components/AdjustmentTypeSelector';
import { StockPreviewCard } from '../components/StockPreviewCard';
import { FormError } from '../../auth/components/AuthCard.styles';
import { FormActions, FormCard } from '../../business/components/FormLayout.styles';
import { isNonNegativeNumber, isRequired, validateFields } from '../../../utils/validation';
import type { TransactionType } from '../types/transaction.types';
import { media } from '../../../styles/breakpoints';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};
  width: 100%;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: ${({ theme }) => theme.spacing(6)};
  align-items: start;

  ${() => media.tabletDown`
    grid-template-columns: 1fr;
  `}
`;

const ProductSummary = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(4)};
  padding-bottom: ${({ theme }) => theme.spacing(5)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ProductName = styled.p`
  margin: 0;
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ProductMeta = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const CurrentStockBlock = styled.div`
  text-align: right;
  flex-shrink: 0;
`;

const CurrentStockLabel = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const CurrentStockValue = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

interface FormValues {
  quantity: string;
  reason: string;
}

export default function AdjustStockPage() {
  const { productId = '' } = useParams<{ productId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const product = useAppSelector((state) => state.inventory.products.find((item) => item.id === productId));
  const listStatus = useAppSelector((state) => state.inventory.status);
  const isAdjusting = useAppSelector((state) => state.transactions.isAdjusting);
  const adjustError = useAppSelector((state) => state.transactions.adjustError);

  const business = useAppSelector((state) => state.business.business);
  const businessId  =  business.length > 0 ? business[0].id : ''

  useEffect(() => {
    if (!product && listStatus === 'idle') {
      dispatch(fetchProducts());
    } else if (!product && listStatus !== 'loading') {
      dispatch(fetchProductById(productId));
    }
  }, [product, listStatus, productId, dispatch]);

  const [type, setType] = useState<TransactionType>('STOCK_IN');
  const [values, setValues] = useState<FormValues>({ quantity: '', reason: '' });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormValues, string>>>({});

  const handleChange =
    (field: keyof FormValues) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
      if (adjustError) dispatch(clearAdjustError());
    };

  if (!product) {
    return <Loader label="Loading product…" />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const errors = validateFields(values, {
      quantity: (value) => {
        if (!isRequired(value)) return 'Adjustment Quantity is required.';
        if (!isNonNegativeNumber(value) || Number(value) <= 0) return 'Enter a quantity greater than 0.';
        return undefined;
      },
    });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (isAdjusting) return;

    const result = await dispatch(
      createTransaction({
        businessId,
        productId: product.id,
        payload: {
          type,
          quantity: Math.abs(Number(values.quantity)),
          reason: values.reason || undefined,
        },
      })
    );
    if (createTransaction.fulfilled.match(result)) {
      navigate(`/products/${product.id}`, { replace: true });
    }
  };

  return (
    <Content>
      <PageHeader
        title="Adjust Stock"
        subtitle="Add or subtract stock quantities for inventory corrections"
        onBack={() => navigate(`/products/${product.id}`)}
      />

      <Layout>
        <FormCard onSubmit={handleSubmit} noValidate>
          <ProductSummary>
            <div>
              <ProductName>{product.name}</ProductName>
              <ProductMeta>SKU: {product.sku || '—'}</ProductMeta>
            </div>
            <CurrentStockBlock>
              <CurrentStockLabel>Current Stock</CurrentStockLabel>
              <CurrentStockValue>{product.currentStock} Units</CurrentStockValue>
            </CurrentStockBlock>
          </ProductSummary>

          {adjustError && <FormError role="alert">{adjustError}</FormError>}

          <FormField label="Adjustment Type" htmlFor="adjustment-type">
            <AdjustmentTypeSelector value={type} onChange={setType} />
          </FormField>

          <FormField label="Adjustment Quantity" htmlFor="quantity" error={fieldErrors.quantity}>
            <Input
              id="quantity"
              type="number"
              min="1"
              step="1"
              placeholder="0"
              value={values.quantity}
              onChange={handleChange('quantity')}
              $hasError={!!fieldErrors.quantity}
            />
          </FormField>

          <FormField label="Reason / Note" htmlFor="reason">
            <TextArea
              id="reason"
              placeholder="e.g. New stock received"
              value={values.reason}
              onChange={handleChange('reason')}
            />
          </FormField>

          <FormActions>
            <Button type="submit" disabled={isAdjusting}>
              {isAdjusting ? 'Updating…' : 'Update Stock'}
            </Button>
            <Button type="button" $variant="ghost" onClick={() => navigate(`/products/${product.id}`)}>
              Cancel
            </Button>
          </FormActions>
        </FormCard>

        <StockPreviewCard
          currentStock={product.currentStock}
          type={type}
          quantity={Number(values.quantity) || 0}
        />
      </Layout>
    </Content>
  );
}
