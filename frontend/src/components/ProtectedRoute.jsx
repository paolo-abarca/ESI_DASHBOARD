import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Sidebar from './Sidebar'

function ProtectedRoute({ children }) {
    const { profesor, loading } = useAuth()

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                <p className="text-slate-600">
                    Cargando...
                </p>
            </div>
        )
    }

    if (!profesor) {
        return <Navigate to="/login" replace />
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <Sidebar />

            <div className="ml-64 min-h-screen">
                {children}
            </div>
        </div>
    )
}

export default ProtectedRoute