import type { BadgeTone } from '../../../components/common/StatusBadge';
import { getStockStatus } from '../../../utils/formatters';

export interface StockStatusMeta {
  tone: BadgeTone;
  label: string;
}

export function getStockStatusMeta(currentStock: number, minimumStock: number): StockStatusMeta {
  const status = getStockStatus(currentStock, minimumStock);
  switch (status) {
    case 'out-of-stock':
      return { tone: 'danger', label: 'Out of Stock' };
    case 'low-stock':
      return { tone: 'warning', label: 'Low Stock' };
    default:
      return { tone: 'success', label: 'In Stock' };
  }
}
