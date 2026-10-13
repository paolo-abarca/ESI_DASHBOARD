import { apiRequest } from './api'

export async function getTareas() {
    return apiRequest('/tareas')
}

export async function getTareaById(tareaId) {
    return apiRequest(`/tareas/${tareaId}`)
}

export async function createTarea(datos) {
    return apiRequest('/tareas', {
        method: 'POST',
        body: JSON.stringify(datos),
    })
}

export async function updateTarea(tareaId, datos) {
    return apiRequest(`/tareas/${tareaId}`, {
        method: 'PUT',
        body: JSON.stringify(datos),
    })
}

export async function updateEstadoTarea(tareaId, estado) {
    return apiRequest(`/tareas/${tareaId}/estado`, {
        method: 'PATCH',
        body: JSON.stringify({ estado }),
    })
}