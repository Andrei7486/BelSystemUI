import { DashboardStats, Order, Unit, Test, TestResult, TestType, UnitStatus } from '../types/models';

const clients = [
    'NovelSat',
    'AYECKA',
    'Orbit Systems',
    'Satcom Global',
    'Telecom Solutions',
    'SkyLink Labs',
    'NorthBridge Networks',
    'BlueWave Communications',
    'Delta RF',
    'Astra Networks',
];

const models = ['NS1000', 'NS3000', 'SM1x', 'GBE-CARD', 'Panel NS1000'];
const operators = ['Andrei', 'David', 'Moshe', 'Daniel', 'Alex', 'Roman'];

const testTypes: TestType[] = ['ate', 'iq_calib', 'power_calib', 'burn_in', 'software', 'license'];

function pad(value: number, length = 4): string {
    return String(value).padStart(length, '0');
}

function getStatusFromProgress(progress: number): Order['status'] {
    if (progress >= 100) return 'shipped';
    if (progress >= 85) return 'ready';
    if (progress >= 55) return 'testing';
    if (progress >= 15) return 'in_progress';
    return 'pending';
}

function getUnitStatus(index: number, orderStatus: Order['status']): UnitStatus {
    if (orderStatus === 'shipped') return 'shipped';
    if (orderStatus === 'ready') return index % 5 === 0 ? 'testing' : 'ready';
    if (orderStatus === 'testing') return index % 3 === 0 ? 'in_progress' : 'testing';
    if (orderStatus === 'in_progress') return index % 2 === 0 ? 'pending' : 'in_progress';
    return 'pending';
}

function getTestResult(unitStatus: UnitStatus, testIndex: number, unitIndex: number): TestResult {
    if (unitStatus === 'ready' || unitStatus === 'shipped') {
        return unitIndex % 17 === 0 && testIndex === 0 ? 'fail' : 'pass';
    }

    if (unitStatus === 'testing') {
        if (testIndex < 3) return unitIndex % 11 === 0 && testIndex === 1 ? 'fail' : 'pass';
        return 'pending';
    }

    if (unitStatus === 'in_progress') {
        if (testIndex < 2) return 'pass';
        return 'pending';
    }

    return 'pending';
}

function createTimestamp(orderIndex: number, unitIndex: number, testIndex: number): string {
    const date = new Date();
    date.setDate(date.getDate() - ((orderIndex + unitIndex + testIndex) % 14));
    date.setHours(8 + ((unitIndex + testIndex) % 9), (testIndex * 10) % 60, 0, 0);
    return date.toISOString();
}

function createTests(orderIndex: number, unitIndex: number, unitStatus: UnitStatus): Test[] {
    return testTypes.map((type, testIndex) => {
        const result = getTestResult(unitStatus, testIndex, unitIndex);

        return {
            id: `test-${orderIndex}-${unitIndex}-${type}`,
            type,
            result,
            timestamp: createTimestamp(orderIndex, unitIndex, testIndex),
            operator: result === 'pending' ? undefined : operators[(orderIndex + unitIndex + testIndex) % operators.length],
            notes:
                result === 'fail'
                    ? 'Requires additional inspection before release.'
                    : result === 'pass'
                        ? 'Completed successfully.'
                        : undefined,
        };
    });
}

export const mockOrders: Order[] = Array.from({ length: 50 }, (_, index) => {
    const orderNumber = `SO-${2026}-${pad(index + 1)}`;
    const progress = (index * 13) % 101;
    const dueDate = new Date(2026, 4 + (index % 4), 1 + (index % 27)).toISOString().slice(0, 10);

    return {
        id: `order-${index + 1}`,
        orderNumber,
        client: clients[index % clients.length],
        quantity: 8 + (index % 10),
        status: getStatusFromProgress(progress),
        progress,
        dueDate,
    };
});

export const mockUnits: Unit[] = mockOrders.flatMap((order, orderIndex) =>
    Array.from({ length: order.quantity }, (_, unitIndex) => {
        const unitStatus = getUnitStatus(unitIndex, order.status);

        return {
            id: `unit-${orderIndex + 1}-${unitIndex + 1}`,
            orderId: order.id,
            serialNumber: `BEL${pad(orderIndex + 1, 3)}${pad(unitIndex + 1, 4)}`,
            model: models[(orderIndex + unitIndex) % models.length],
            status: unitStatus,
            tests: createTests(orderIndex + 1, unitIndex + 1, unitStatus),
        };
    }),
);

export async function getOrders(): Promise<Order[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockOrders;
}

export async function getUnitsByOrderId(orderId: string): Promise<Unit[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockUnits.filter(unit => unit.orderId === orderId);
}

export function getDashboardStats(orders: Order[]): DashboardStats {
    return {
        totalOrders: orders.length,
        inProgress: orders.filter(order => order.status === 'in_progress' || order.status === 'testing').length,
        ready: orders.filter(order => order.status === 'ready').length,
        shipped: orders.filter(order => order.status === 'shipped').length,
    };
}