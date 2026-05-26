import { useState, useEffect, useMemo } from 'react';
import { Order, OrderStatus, SortBy } from '../types/models';
import { getOrders, getDashboardStats } from '../services/mocks';
import { formatDisplayDate } from '../utils/dates';
import { StatusBadge } from './StatusBadge';
import { ProgressBar } from './ProgressBar';
import { LoadingSpinner } from './LoadingSpinner';
import { Header } from './Header';
import { Search } from 'lucide-react';

interface OrdersDashboardProps {
    onSelectOrder: (order: Order) => void;
}

const VALID_STATUSES: OrderStatus[] = ['all', 'pending', 'in_progress', 'testing', 'ready', 'shipped'];
const VALID_SORTS: SortBy[] = ['number', 'client', 'progress', 'dueDate'];

export function OrdersDashboard({ onSelectOrder }: OrdersDashboardProps) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<OrderStatus>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortBy>('number');

    useEffect(() => {
        const loadOrders = async () => {
            setLoading(true);
            const data = await getOrders();
            setOrders(data);
            setLoading(false);
        };
        loadOrders();
    }, []);

    // Используем useMemo для оптимизации и избегаем мутации
    const filteredAndSortedOrders = useMemo(() => {
        // Копируем массив, чтобы избежать мутации state
        let filtered = [...orders];

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(o => o.status === statusFilter);
        }

        // Apply search
        const trimmedQuery = searchQuery.trim();
        if (trimmedQuery) {
            const query = trimmedQuery.toLowerCase();
            filtered = filtered.filter(o =>
                o.orderNumber.toLowerCase().includes(query) ||
                o.client.toLowerCase().includes(query)
            );
        }

        // Apply sorting (на копии массива!)
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'number':
                    return a.orderNumber.localeCompare(b.orderNumber);
                case 'client':
                    return a.client.localeCompare(b.client);
                case 'progress':
                    return b.progress - a.progress;
                case 'dueDate':
                    // Строковое сравнение дат (YYYY-MM-DD формат)
                    return a.dueDate.localeCompare(b.dueDate);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [orders, statusFilter, searchQuery, sortBy]);

    const stats = getDashboardStats(orders);

    const handleStatusFilterChange = (value: string) => {
        if (VALID_STATUSES.includes(value as OrderStatus)) {
            setStatusFilter(value as OrderStatus);
        }
    };

    const handleSortChange = (value: string) => {
        if (VALID_SORTS.includes(value as SortBy)) {
            setSortBy(value as SortBy);
        }
    };

    const handleRowKeyDown = (e: React.KeyboardEvent, order: Order) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectOrder(order);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header title="BEL System Dashboard" subtitle="Orders Management & Monitoring" />

            {/* Stats Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                        <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                        <p className="text-gray-600 text-sm font-medium">In Progress</p>
                        <p className="text-3xl font-bold text-blue-600 mt-2">{stats.inProgress}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                        <p className="text-gray-600 text-sm font-medium">Ready</p>
                        <p className="text-3xl font-bold text-green-600 mt-2">{stats.ready}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                        <p className="text-gray-600 text-sm font-medium">Shipped</p>
                        <p className="text-3xl font-bold text-purple-600 mt-2">{stats.shipped}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-2">
                                Search
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    id="search-input"
                                    type="text"
                                    placeholder="Order # or Client..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                id="status-filter"
                                value={statusFilter}
                                onChange={(e) => handleStatusFilterChange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            >
                                <option value="all">All</option>
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="testing">Testing</option>
                                <option value="ready">Ready</option>
                                <option value="shipped">Shipped</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-2">
                                Sort By
                            </label>
                            <select
                                id="sort-by"
                                value={sortBy}
                                onChange={(e) => handleSortChange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            >
                                <option value="number">Order Number</option>
                                <option value="client">Client</option>
                                <option value="progress">Progress</option>
                                <option value="dueDate">Due Date</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Results</label>
                            <div className="px-3 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium">
                                {filteredAndSortedOrders.length} of {orders.length}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-gray-900">Order #</th>
                                <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-gray-900">Client</th>
                                <th className="px-4 sm:px-6 py-4 text-center text-sm font-semibold text-gray-900">Qty</th>
                                <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-gray-900">Progress</th>
                                <th className="hidden md:table-cell px-4 sm:px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Due Date
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {filteredAndSortedOrders.map(order => (
                                <tr
                                    key={order.id}
                                    onClick={() => onSelectOrder(order)}
                                    onKeyDown={(e) => handleRowKeyDown(e, order)}
                                    role="button"
                                    tabIndex={0}
                                    className="hover:bg-gray-50 cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                                >
                                    <td className="px-4 sm:px-6 py-4">
                      <span className="font-mono font-semibold text-blue-600 hover:text-blue-800">
                        {order.orderNumber}
                      </span>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 text-gray-700 truncate">{order.client}</td>
                                    <td className="px-4 sm:px-6 py-4 text-gray-700 text-center font-medium">{order.quantity}</td>
                                    <td className="px-4 sm:px-6 py-4">
                                        <StatusBadge status={order.status} size="sm" />
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 min-w-[150px]">
                                        <ProgressBar progress={order.progress} showLabel={true} size="sm" />
                                    </td>
                                    <td className="hidden md:table-cell px-4 sm:px-6 py-4 text-gray-700 text-sm whitespace-nowrap">
                                        {formatDisplayDate(order.dueDate)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {filteredAndSortedOrders.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500 font-medium">No orders found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}