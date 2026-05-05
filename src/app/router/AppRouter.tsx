import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Dashboard } from '@/pages/Dashboard/Dashboard'

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard />} />
            </Routes>
        </BrowserRouter>
    )
}