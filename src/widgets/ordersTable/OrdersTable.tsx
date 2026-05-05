import type {Order} from '@/entities/order/types'

type Props = {
    orders: Order[]
}

export const OrdersTable = ({ orders }: Props) => {
    return (
        <div style={{ padding: '16px' }}>
            <h2>Orders</h2>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr>
                    <th>Order</th>
                    <th>Client</th>
                    <th>Model</th>
                    <th>Progress</th>
                    <th>Status</th>
                    <th>Due Date</th>
                </tr>
                </thead>

                <tbody>
                {orders.map((order) => {
                    const progress =
                        (order.qtyReady / order.qtyRequired) * 100

                    return (
                        <tr key={order.orderId}>
                            <td>{order.orderId}</td>
                            <td>{order.client}</td>
                            <td>{order.model}</td>

                            <td>
                                {order.qtyReady}/{order.qtyRequired} (
                                {progress.toFixed(0)}%)
                            </td>

                            <td>{order.status}</td>
                            <td>{order.dueDate}</td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </div>
    )
}