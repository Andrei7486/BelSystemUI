import { useState, useEffect } from 'react';
import { Unit, Test } from '../types/models';
import { formatDisplayDateTime, formatRelativeTime } from '../utils/dates';
import { Header } from './Header';
import { StatusBadge } from './StatusBadge';
import { LoadingSpinner } from './LoadingSpinner';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface UnitDetailProps {
    unit: Unit;
    onBack: () => void;
}

const testTypeLabels: Record<string, string> = {
    ate: 'ATE Test',
    iq_calib: 'IQ Calibration',
    power_calib: 'Power Calibration',
    burn_in: 'Burn-In Test',
    software: 'Software Upload',
    license: 'License Registration',
};

const getResultIcon = (result: Test['result']) => {
    switch (result) {
        case 'pass':
            return <CheckCircle size={20} className="text-green-600" />;

        case 'fail':
            return <XCircle size={20} className="text-red-600" />;

        case 'pending':
            return <Clock size={20} className="text-gray-400" />;

        default:
            return null;
    }
};

const getResultColor = (result: Test['result']) => {
    switch (result) {
        case 'pass':
            return 'bg-green-50 border-green-200';

        case 'fail':
            return 'bg-red-50 border-red-200';

        case 'pending':
            return 'bg-gray-50 border-gray-200';

        default:
            return 'bg-white border-gray-200';
    }
};

export function UnitDetail({ unit, onBack }: UnitDetailProps) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        const timer = setTimeout(() => {
            setLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [unit.id]);

    if (loading) {
        return <LoadingSpinner />;
    }

    const passedTests = unit.tests.filter(
        t => t.result === 'pass',
    ).length;

    const failedTests = unit.tests.filter(
        t => t.result === 'fail',
    ).length;

    const pendingTests = unit.tests.filter(
        t => t.result === 'pending',
    ).length;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                title={`Unit ${unit.serialNumber}`}
                subtitle={`Model: ${unit.model}`}
                onBack={onBack}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Unit Info Card */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                        <div>
                            <p className="text-sm text-gray-600 font-medium">
                                Serial Number
                            </p>

                            <p className="text-lg font-semibold text-gray-900 mt-1 font-mono">
                                {unit.serialNumber}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-600 font-medium">
                                Model
                            </p>

                            <p className="text-lg font-semibold text-gray-900 mt-1">
                                {unit.model}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-600 font-medium">
                                Status
                            </p>

                            <div className="mt-1">
                                <StatusBadge status={unit.status} size="md" />
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-gray-600 font-medium">
                                Order ID
                            </p>

                            <p className="text-lg font-semibold text-gray-900 mt-1 font-mono text-sm">
                                {unit.orderId}
                            </p>
                        </div>

                    </div>
                </div>

                {/* Test Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

                    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                        <div className="flex items-center gap-3">

                            <CheckCircle
                                size={32}
                                className="text-green-600"
                            />

                            <div>
                                <p className="text-gray-600 text-sm font-medium">
                                    Passed
                                </p>

                                <p className="text-2xl font-bold text-gray-900">
                                    {passedTests}
                                </p>
                            </div>

                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                        <div className="flex items-center gap-3">

                            <XCircle
                                size={32}
                                className="text-red-600"
                            />

                            <div>
                                <p className="text-gray-600 text-sm font-medium">
                                    Failed
                                </p>

                                <p className="text-2xl font-bold text-gray-900">
                                    {failedTests}
                                </p>
                            </div>

                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                        <div className="flex items-center gap-3">

                            <Clock
                                size={32}
                                className="text-gray-400"
                            />

                            <div>
                                <p className="text-gray-600 text-sm font-medium">
                                    Pending
                                </p>

                                <p className="text-2xl font-bold text-gray-900">
                                    {pendingTests}
                                </p>
                            </div>

                        </div>
                    </div>

                </div>

                {/* Tests Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">

                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">

                        <h2 className="text-lg font-semibold text-gray-900">
                            Test Results ({unit.tests.length} total)
                        </h2>

                    </div>

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-full">

                            <thead className="bg-gray-50 border-b border-gray-200">

                            <tr>

                                <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Test Type
                                </th>

                                <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Result
                                </th>

                                <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Time
                                </th>

                                <th className="hidden sm:table-cell px-4 sm:px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Operator
                                </th>

                                <th className="hidden lg:table-cell px-4 sm:px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Notes
                                </th>

                            </tr>

                            </thead>

                            <tbody className="divide-y divide-gray-200">

                            {unit.tests.length > 0 ? (

                                unit.tests.map(test => (

                                    <tr
                                        key={test.id}
                                        className={`hover:bg-gray-50 transition ${getResultColor(test.result)}`}
                                    >

                                        <td className="px-4 sm:px-6 py-4">

                                            <div className="flex items-center gap-3">

                                                {getResultIcon(test.result)}

                                                <span className="font-medium text-gray-900">
                            {testTypeLabels[test.type]}
                          </span>

                                            </div>

                                        </td>

                                        <td className="px-4 sm:px-6 py-4">

                        <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                test.result === 'pass'
                                    ? 'bg-green-100 text-green-800'
                                    : test.result === 'fail'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                          {test.result === 'pass'
                              ? '✓ PASS'
                              : test.result === 'fail'
                                  ? '✗ FAIL'
                                  : '○ PENDING'}
                        </span>

                                        </td>

                                        <td className="px-4 sm:px-6 py-4">

                                            <div className="flex flex-col">

                          <span className="text-sm font-medium text-gray-900">
                            {formatDisplayDateTime(test.timestamp)}
                          </span>

                                                <span className="text-xs text-gray-500">
                            {formatRelativeTime(test.timestamp)}
                          </span>

                                            </div>

                                        </td>

                                        <td className="hidden sm:table-cell px-4 sm:px-6 py-4 text-sm text-gray-600">
                                            {test.operator || '—'}
                                        </td>

                                        <td className="hidden lg:table-cell px-4 sm:px-6 py-4 text-sm text-gray-600">

                                            {test.notes ? (

                                                <div className="max-w-xs">

                                                    <p
                                                        className="truncate"
                                                        title={test.notes}
                                                    >
                                                        {test.notes}
                                                    </p>

                                                </div>

                                            ) : (

                                                <span className="text-gray-400">
                            —
                          </span>

                                            )}

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan={5}
                                        className="px-4 sm:px-6 py-12 text-center text-gray-500 font-medium"
                                    >
                                        No tests found
                                    </td>

                                </tr>

                            )}

                            </tbody>

                        </table>

                    </div>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden mt-8">

                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Test Details
                    </h2>

                    <div className="space-y-4">

                        {unit.tests.map(test => (

                            <div
                                key={test.id}
                                className={`rounded-lg shadow p-4 border-l-4 ${
                                    test.result === 'pass'
                                        ? 'border-green-500 bg-green-50'
                                        : test.result === 'fail'
                                            ? 'border-red-500 bg-red-50'
                                            : 'border-gray-400 bg-gray-50'
                                }`}
                            >

                                <div className="flex items-start justify-between mb-2">

                                    <div className="flex items-center gap-2">

                                        {getResultIcon(test.result)}

                                        <div>

                                            <p className="font-semibold text-gray-900">
                                                {testTypeLabels[test.type]}
                                            </p>

                                            <p className="text-xs text-gray-600 mt-1">
                                                {formatDisplayDateTime(test.timestamp)}
                                            </p>

                                        </div>

                                    </div>

                                    <span
                                        className={`text-xs font-bold px-2 py-1 rounded ${
                                            test.result === 'pass'
                                                ? 'bg-green-200 text-green-800'
                                                : test.result === 'fail'
                                                    ? 'bg-red-200 text-red-800'
                                                    : 'bg-gray-200 text-gray-800'
                                        }`}
                                    >
                    {test.result === 'pass'
                        ? 'PASS'
                        : test.result === 'fail'
                            ? 'FAIL'
                            : 'PENDING'}
                  </span>

                                </div>

                                <p className="text-sm text-gray-600 mb-2">
                                    {formatRelativeTime(test.timestamp)}
                                </p>

                                {test.operator && (
                                    <p className="text-xs text-gray-600 mb-2">
                    <span className="font-medium">
                      Operator:
                    </span>{' '}
                                        {test.operator}
                                    </p>
                                )}

                                {test.notes && (
                                    <p className="text-sm text-gray-700 bg-white bg-opacity-50 p-2 rounded">
                    <span className="font-medium">
                      Notes:
                    </span>{' '}
                                        {test.notes}
                                    </p>
                                )}

                            </div>

                        ))}

                    </div>
                </div>

            </div>
        </div>
    );
}