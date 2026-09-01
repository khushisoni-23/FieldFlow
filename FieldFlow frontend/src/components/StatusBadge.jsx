import React from 'react';
import Badge from './Badge';

const StatusBadge = ({ status, className = '' }) => {
  const normalized = (status || '').toLowerCase().trim();

  let variant = 'neutral';
  let label = status || 'Unknown';

  switch (normalized) {
    case 'pending':
      variant = 'warning';
      label = 'Pending';
      break;
    case 'assigned':
      variant = 'info';
      label = 'Assigned';
      break;
    case 'on the way':
    case 'ontheway':
      variant = 'primary';
      label = 'On The Way';
      break;
    case 'arrived':
      variant = 'primary';
      label = 'Arrived';
      break;
    case 'in progress':
    case 'inprogress':
      variant = 'info';
      label = 'In Progress';
      break;
    case 'completed':
      variant = 'success';
      label = 'Completed';
      break;
    case 'paid':
      variant = 'success';
      label = 'Paid';
      break;
    case 'delayed':
      variant = 'danger';
      label = 'Delayed';
      break;
    default:
      variant = 'neutral';
      label = status;
  }

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
};

export default StatusBadge;
