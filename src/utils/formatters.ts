export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/** Stock is "low" once it has dropped to (or below) the minimum threshold. */
export function isLowStock(currentStock: number, minimumStock: number): boolean {
  return currentStock <= minimumStock;
}
