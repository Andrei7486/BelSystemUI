import { OrderStatus, UnitStatus } from '../types/models';

type StatusBadgeStatus = Exclude<OrderStatus, 'all'> | UnitStatus;

interface StatusBadgeProps {
    status: StatusBadgeStatus;
    size?: 'sm' | 'md';
}

const statusStyles: Record<StatusBadgeStatus, string> = {
    pending: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    testing: 'bg-yellow-100 text-yellow-800',
    ready: 'bg-green-100 text-green-800',
    shipped: 'bg-purple-100 text-purple-800',
};

const statusLabels: Record<StatusBadgeStatus, string> = {
    pending: 'Pending',
    in_progress: 'In Progress',
    testing: 'Testing',
    ready: 'Ready',
    shipped: 'Shipped',
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
    const sizeClass = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm';

    return (
        <span className={`inline-flex items-center rounded-full font-semibold ${sizeClass} ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
    );
}