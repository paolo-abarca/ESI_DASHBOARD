
import { apiRequest } from './api'

export async function getCalificaciones() {
    return apiRequest('/calificaciones')
}

export async function getCalificacionById(calificacionId) {
    return apiRequest(`/calificaciones/${calificacionId}`)
}

export async function createCalificacion(datos) {
    return apiRequest('/calificaciones', {
        method: 'POST',
        body: JSON.stringify(datos),
    })
}

export async function updateCalificacion(calificacionId, datos) {
    return apiRequest(`/calificaciones/${calificacionId}`, {
        method: 'PUT',
        body: JSON.stringify(datos),
    })
}