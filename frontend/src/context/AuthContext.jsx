import { useEffect, useState } from 'react'
import { AuthContext } from './auth-context'
import { apiRequest } from '../services/api'

export function AuthProvider({ children }) {
    const [profesor, setProfesor] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function restoreSession() {
            const token = localStorage.getItem('access_token')

            if (!token) {
                setLoading(false)
                return
            }

            try {
                const response = await apiRequest('/auth/me')
                setProfesor(response.data)
            // eslint-disable-next-line no-unused-vars
            } catch (error) {
                localStorage.removeItem('access_token')
                setProfesor(null)
            } finally {
                setLoading(false)
            }
        }

        restoreSession()
    }, [])

    return (
        <AuthContext.Provider
            value={{
                profesor,
                setProfesor,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}