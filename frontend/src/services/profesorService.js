import { apiRequest } from './api'

export async function getProfesores() {
    const response = await apiRequest('/profesores')
    return response.data
}

export async function getProfesorById(profesorId) {
    const response = await apiRequest(`/profesores/${profesorId}`)
    return response.data
}

export async function updateProfesor(profesorId, datos) {
    const response = await apiRequest(`/profesores/${profesorId}`, {
        method: 'PUT',
        body: JSON.stringify(datos),
    })

    return response.data
}