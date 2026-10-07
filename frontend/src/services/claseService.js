import { apiRequest } from './api'

export async function getClases() {
    return apiRequest('/clases')
}

export async function getClaseById(claseId) {
    return apiRequest(`/clases/${claseId}`)
}

export async function createClase(datos) {
    return apiRequest('/clases', {
        method: 'POST',
        body: JSON.stringify(datos),
    })
}

export async function updateClase(claseId, datos) {
    return apiRequest(`/clases/${claseId}`, {
        method: 'PUT',
        body: JSON.stringify(datos),
    })
}

export async function deactivateClase(claseId) {
    return apiRequest(`/clases/${claseId}/desactivar`, {
        method: 'PATCH',
    })
}