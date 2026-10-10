import { apiRequest } from './api'

export async function getAsistencias() {
    return apiRequest('/asistencias')
}

export async function getAsistenciasByClase(claseId) {
    return apiRequest(`/asistencias/clase/${claseId}`)
}

export async function getAlumnosByClase(claseId) {
    return apiRequest(
        `/asistencias/clase/${claseId}/alumnos`
    )
}

export async function getAsistenciaById(asistenciaId) {
    return apiRequest(`/asistencias/${asistenciaId}`)
}

export async function createAsistencia(datos) {
    return apiRequest('/asistencias', {
        method: 'POST',
        body: JSON.stringify(datos),
    })
}

export async function updateAsistencia(asistenciaId, datos) {
    return apiRequest(`/asistencias/${asistenciaId}`, {
        method: 'PUT',
        body: JSON.stringify(datos),
    })
}