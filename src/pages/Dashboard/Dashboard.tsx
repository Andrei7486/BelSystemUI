import { OrdersTable } from '@/widgets/ordersTable/OrdersTable'
import { mockOrders } from '@/entities/order/mock'

export const Dashboard = () => {
    return (
        <div>
            <h1>Dashboard</h1>
            <OrdersTable orders={mockOrders} />
        </div>
    )
}