import { apiRequest } from './api'

export async function getInstrumentos() {
    const response = await apiRequest('/instrumentos')

    return response.data
}