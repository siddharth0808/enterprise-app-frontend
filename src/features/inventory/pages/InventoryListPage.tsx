import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Button } from '../../../components/common/Button';
import { Loader } from '../../../components/common/Loader';
import { ErrorState } from '../../../components/common/ErrorState';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { fetchProducts } from '../store/inventorySlice';
import { ProductSearch } from '../components/ProductSearch';
import { ProductTable } from '../components/ProductTable';
import { ProductCardList } from '../components/ProductCard';
import { EmptyInventory } from '../components/EmptyInventory';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(5)};
  width: 100%;
`;

export default function InventoryListPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { products, status, error } = useAppSelector((state) => state.inventory);
  const [query, setQuery] = useState('');
  const business = useAppSelector((state) => state.business.business);
  const businessId  =  business.length > 0 ? business[0].id : ''

  useEffect(() => {
    dispatch(fetchProducts(businessId));
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return products;
    return products.filter((product) =>
      [product.name, product.sku, product.brand, product.category]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(trimmed))
    );
  }, [products, query]);

  const renderBody = () => {
    if (status === 'loading' || status === 'idle') {
      return <Loader label="Loading inventory…" />;
    }
    if (status === 'failed') {
      return <ErrorState message={error ?? 'Failed to load products.'} onRetry={() => dispatch(fetchProducts(businessId))} />;
    }
    if (filteredProducts.length === 0) {
      return <EmptyInventory isFiltered={products.length > 0 && filteredProducts.length === 0} />;
    }
    return (
      <>
        <ProductTable products={filteredProducts} />
        <ProductCardList products={filteredProducts} />
      </>
    );
  };

  return (
    <Content>
      <PageHeader
        title="Inventory"
        subtitle="Track stock levels and manage your product catalog"
        action={
          <Button type="button" onClick={() => navigate('/products/new')}>
            + Add Product
          </Button>
        }
      />
      <ProductSearch value={query} onChange={setQuery} />
      {renderBody()}
    </Content>
  );
}
