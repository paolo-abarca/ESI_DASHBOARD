import { apiRequest } from './api'

export async function getInstrumentosByProfesor(profesorId) {
    const response = await apiRequest(
        `/profesores/${profesorId}/instrumentos`
    )

    return response.data
}

export async function assignInstrumento(profesorId, instrumentoId) {
    const response = await apiRequest(
        `/profesores/${profesorId}/instrumentos/${instrumentoId}`,
        {
            method: 'POST',
        }
    )

    return response.data
}

export async function deactivateInstrumento(
    profesorId,
    instrumentoId
) {
    return apiRequest(
        `/profesores/${profesorId}/instrumentos/${instrumentoId}/desactivar`,
        {
            method: 'PATCH'
        }
    )
}