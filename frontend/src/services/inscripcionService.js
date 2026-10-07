import { apiRequest } from './api'

export async function getInscripciones() {
    const response = await apiRequest('/inscripciones')
    return response.data
}

export async function getInscripcionesByAlumno(alumnoId) {
    return apiRequest(`/inscripciones/alumno/${alumnoId}`)
}

export async function getInscripcionById(inscripcionId) {
    return apiRequest(`/inscripciones/${inscripcionId}`)
}

export async function createInscripcion(datos) {
    const response = await apiRequest('/inscripciones', {
        method: 'POST',
        body: JSON.stringify(datos),
    })

    return response.data
}

export async function updateInscripcion(inscripcionId, datos) {
    const response = await apiRequest(`/inscripciones/${inscripcionId}`, {
        method: 'PUT',
        body: JSON.stringify(datos),
    })

    return response.data
}

export async function deactivateInscripcion(inscripcionId) {
    return apiRequest(`/inscripciones/${inscripcionId}/desactivar`, {
        method: 'PATCH',
    })
}