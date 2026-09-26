import { useState } from 'react'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
    const [profesor, setProfesor] = useState(null)
    const [loading, setLoading] = useState(true)

    return (
        <AuthContext.Provider
            value={{
                profesor,
                setProfesor,
                loading,
                setLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}