import { apiRequest } from './api'

export async function getAlumnos() {
    const response = await apiRequest('/alumnos')
    return response.data
}

export async function getAlumnoById(alumnoId) {
    const response = await apiRequest(`/alumnos/${alumnoId}`)
    return response.data
}

export async function createAlumno(datos) {
    const response = await apiRequest('/alumnos', {
        method: 'POST',
        body: JSON.stringify(datos),
    })

    return response.data
}

export async function updateAlumno(alumnoId, datos) {
    const response = await apiRequest(`/alumnos/${alumnoId}`, {
        method: 'PUT',
        body: JSON.stringify(datos),
    })

    return response.data
}

export async function deactivateAlumno(alumnoId) {
    return apiRequest(`/alumnos/${alumnoId}/desactivar`, {
        method: 'PATCH',
    })
}