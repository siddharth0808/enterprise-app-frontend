import { useNavigate } from 'react-router-dom';
import { EmptyState } from '../../../components/common/EmptyState';
import { Button } from '../../../components/common/Button';

interface EmptyInventoryProps {
  isFiltered: boolean;
}

export function EmptyInventory({ isFiltered }: EmptyInventoryProps) {
  const navigate = useNavigate();

  if (isFiltered) {
    return (
      <EmptyState
        title="No matching products"
        description="Try a different search term, or clear the search to see your full inventory."
      />
    );
  }

  return (
    <EmptyState
      title="No products yet"
      description="Add your first product to start tracking stock, pricing, and inventory levels."
      action={
        <Button type="button" onClick={() => navigate('/products/new')}>
          Add Product
        </Button>
      }
    />
  );
}
