import { useEffect, useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { Order, Unit } from '../types/models';
import { getUnitsByOrderId } from '../services/mocks';
import { formatDisplayDate } from '../utils/dates';
import { Header } from './Header';
import { LoadingSpinner } from './LoadingSpinner';
import { ProgressBar } from './ProgressBar';
import { StatusBadge } from './StatusBadge';

interface OrderDetailProps {
    order: Order;
    onBack: () => void;
    onSelectUnit: (unit: Unit) => void;
}

export function OrderDetail({ order, onBack, onSelectUnit }: OrderDetailProps) {
    const [units, setUnits] = useState<Unit[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUnits = async () => {
            setLoading(true);
            const data = await getUnitsByOrderId(order.id);
            setUnits(data);
            setLoading(false);
        };

        loadUnits();
    }, [order.id]);

    const handleRowKeyDown = (e: React.KeyboardEvent, unit: Unit) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectUnit(unit);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header title={`Order ${order.orderNumber}`} subtitle={order.client} onBack={onBack} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Order Number</p>
                            <p className="text-lg font-semibold text-gray-900 mt-1 font-mono">
                                {order.orderNumber}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-600 font-medium">Client</p>
                            <p className="text-lg font-semibold text-gray-900 mt-1">
                                {order.client}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-600 font-medium">Quantity</p>
                            <p className="text-lg font-semibold text-gray-900 mt-1">
                                {order.quantity}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-600 font-medium">Due Date</p>
                            <p className="text-lg font-semibold text-gray-900 mt-1">
                                {formatDisplayDate(order.dueDate)}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-600 font-medium">Status</p>
                            <div className="mt-1">
                                <StatusBadge status={order.status} size="md" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-gray-600 font-medium">Order Progress</p>
                            <p className="text-sm font-semibold text-gray-900">
                                {order.progress}%
                            </p>
                        </div>

                        <ProgressBar progress={order.progress} size="md" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
                        <ClipboardList size={22} className="text-blue-600" />
                        <h2 className="text-lg font-semibold text-gray-900">
                            Units ({units.length} total)
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Serial Number
                                </th>

                                <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Model
                                </th>

                                <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Status
                                </th>

                                <th className="px-4 sm:px-6 py-4 text-center text-sm font-semibold text-gray-900">
                                    Passed
                                </th>

                                <th className="px-4 sm:px-6 py-4 text-center text-sm font-semibold text-gray-900">
                                    Failed
                                </th>

                                <th className="hidden md:table-cell px-4 sm:px-6 py-4 text-center text-sm font-semibold text-gray-900">
                                    Pending
                                </th>
                            </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                            {units.map(unit => {
                                const passed = unit.tests.filter(test => test.result === 'pass').length;
                                const failed = unit.tests.filter(test => test.result === 'fail').length;
                                const pending = unit.tests.filter(test => test.result === 'pending').length;

                                return (
                                    <tr
                                        key={unit.id}
                                        onClick={() => onSelectUnit(unit)}
                                        onKeyDown={(e) => handleRowKeyDown(e, unit)}
                                        role="button"
                                        tabIndex={0}
                                        className="hover:bg-gray-50 cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                                    >
                                        <td className="px-4 sm:px-6 py-4">
                        <span className="font-mono font-semibold text-blue-600 hover:text-blue-800">
                          {unit.serialNumber}
                        </span>
                                        </td>

                                        <td className="px-4 sm:px-6 py-4 text-gray-700">
                                            {unit.model}
                                        </td>

                                        <td className="px-4 sm:px-6 py-4">
                                            <StatusBadge status={unit.status} size="sm" />
                                        </td>

                                        <td className="px-4 sm:px-6 py-4 text-center font-semibold text-green-700">
                                            {passed}
                                        </td>

                                        <td className="px-4 sm:px-6 py-4 text-center font-semibold text-red-700">
                                            {failed}
                                        </td>

                                        <td className="hidden md:table-cell px-4 sm:px-6 py-4 text-center font-semibold text-gray-600">
                                            {pending}
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>

                        {units.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500 font-medium">
                                    No units found
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}