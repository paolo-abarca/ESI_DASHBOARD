const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'

export async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('access_token')

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    })

    const data = await response.json()

    if (!response.ok) {
        console.error('ERROR API:', response.status, data)

        throw new Error(
            data.message ||
            data.msg ||
            'Ocurrió un error en la solicitud'
        )
    }

    return data
}