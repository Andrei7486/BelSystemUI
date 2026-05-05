import type {Order} from './types'

export const mockOrders: Order[] = [
    {
        orderId: 'SO-1001',
        client: 'SpaceX',
        model: 'NS3000',

        qtyRequired: 10,
        qtyReady: 4,

        status: 'IN_PROGRESS',
        dueDate: '2026-05-20',
    },
    {
        orderId: 'SO-1002',
        client: 'Amazon',
        model: 'NS2000',

        qtyRequired: 5,
        qtyReady: 5,

        status: 'READY',
        dueDate: '2026-05-10',
    },
    {
        orderId: 'SO-1003',
        client: 'Tesla',
        model: 'NS1000',

        qtyRequired: 8,
        qtyReady: 2,

        status: 'IN_PROGRESS',
        dueDate: '2026-05-25',
    },
    {
        orderId: 'SO-1004',
        client: 'Intel',
        model: 'NS3000',

        qtyRequired: 12,
        qtyReady: 0,

        status: 'NOT_STARTED',
        dueDate: '2026-06-01',
    },
    {
        orderId: 'SO-1005',
        client: 'Nvidia',
        model: 'NS4000',

        qtyRequired: 6,
        qtyReady: 3,

        status: 'HOLD',
        dueDate: '2026-05-18',
    },
]