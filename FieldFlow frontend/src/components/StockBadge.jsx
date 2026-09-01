import React from 'react';
import Badge from './Badge';

const StockBadge = ({ status, stockCount }) => {
  const normalized = (status || '').toLowerCase().trim();
  let variant = 'neutral';
  let label = status || 'N/A';

  switch (normalized) {
    case 'in stock':
    case 'instock':
      variant = 'success';
      label = `In Stock (${stockCount})`;
      break;
    case 'low stock':
    case 'lowstock':
      variant = 'warning';
      label = `Low Stock (${stockCount})`;
      break;
    case 'critical':
      variant = 'danger';
      label = 'Out of Stock (0)';
      break;
    default:
      variant = 'neutral';
      label = `${status} (${stockCount})`;
  }

  return (
    <Badge variant={variant}>
      {label}
    </Badge>
  );
};

export default StockBadge;
