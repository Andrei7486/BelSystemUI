// Order main entity type

export type OrderStatus =
    | 'NOT_STARTED'
    | 'IN_PROGRESS'
    | 'READY'
    | 'HOLD'
    | 'PROBLEM'

// Core Order type

export interface Order {
    orderId: string
    client: string
    model: string

    qtyRequired: number
    qtyReady: number

    status: OrderStatus
    dueDate: string // ISO format: "2026-05-05"
}