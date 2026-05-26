export type OrderStatus = 'all' | 'pending' | 'in_progress' | 'testing' | 'ready' | 'shipped';

export type UnitStatus = 'pending' | 'in_progress' | 'testing' | 'ready' | 'shipped';

export type SortBy = 'number' | 'client' | 'progress' | 'dueDate';

export type TestType = 'ate' | 'iq_calib' | 'power_calib' | 'burn_in' | 'software' | 'license';

export type TestResult = 'pass' | 'fail' | 'pending';

export interface Test {
    id: string;
    type: TestType;
    result: TestResult;
    timestamp: string;
    operator?: string;
    notes?: string;
}

export interface Unit {
    id: string;
    orderId: string;
    serialNumber: string;
    model: string;
    status: UnitStatus;
    tests: Test[];
}

export interface Order {
    id: string;
    orderNumber: string;
    client: string;
    quantity: number;
    status: Exclude<OrderStatus, 'all'>;
    progress: number;
    dueDate: string;
}

export interface DashboardStats {
    totalOrders: number;
    inProgress: number;
    ready: number;
    shipped: number;
}