import { useState } from 'react';
import { Order, Unit } from './types/models';
import { OrdersDashboard } from './components/OrdersDashboard';
import { OrderDetail } from './components/OrderDetail';
import { UnitDetail } from './components/UnitDetail';

type View = 'dashboard' | 'order' | 'unit';

export default function App() {
    const [view, setView] = useState<View>('dashboard');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

    const handleSelectOrder = (order: Order) => {
        setSelectedOrder(order);
        setSelectedUnit(null);
        setView('order');
    };

    const handleSelectUnit = (unit: Unit) => {
        setSelectedUnit(unit);
        setView('unit');
    };

    const handleBackToDashboard = () => {
        setSelectedOrder(null);
        setSelectedUnit(null);
        setView('dashboard');
    };

    const handleBackToOrder = () => {
        setSelectedUnit(null);
        setView('order');
    };

    if (view === 'order' && selectedOrder) {
        return <OrderDetail order={selectedOrder} onBack={handleBackToDashboard} onSelectUnit={handleSelectUnit} />;
    }

    if (view === 'unit' && selectedUnit) {
        return <UnitDetail unit={selectedUnit} onBack={handleBackToOrder} />;
    }

    return <OrdersDashboard onSelectOrder={handleSelectOrder} />;