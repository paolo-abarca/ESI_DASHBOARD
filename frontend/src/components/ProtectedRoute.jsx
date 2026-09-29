import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

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

    return children
}

export default ProtectedRoute