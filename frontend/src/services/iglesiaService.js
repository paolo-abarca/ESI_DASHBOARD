import { apiRequest } from './api'

export async function getIglesias() {
    const response = await apiRequest('/iglesias')
    return response.data
}

export async function getIglesiaById(iglesiaId) {
    const response = await apiRequest(`/iglesias/${iglesiaId}`)
    return response.data
}

export async function createIglesia(datos) {
    const response = await apiRequest('/iglesias', {
        method: 'POST',
        body: JSON.stringify(datos),
    })

    return response.data
}

export async function updateIglesia(iglesiaId, datos) {
    const response = await apiRequest(`/iglesias/${iglesiaId}`, {
        method: 'PUT',
        body: JSON.stringify(datos),
    })

    return response.data
}

export async function deactivateIglesia(iglesiaId) {
    return apiRequest(`/iglesias/${iglesiaId}/desactivar`, {
        method: 'PATCH',
    })
}