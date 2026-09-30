import { apiRequest } from './api'

export async function getIglesiasByProfesor(profesorId) {
    const response = await apiRequest(
        `/profesores/${profesorId}/iglesias`
    )

    return response.data
}

export async function assignIglesia(profesorId, iglesiaId) {
    const response = await apiRequest(
        `/profesores/${profesorId}/iglesias/${iglesiaId}`,
        {
            method: 'POST',
        }
    )

    return response.data
}

export async function deactivateIglesia(profesorId, iglesiaId) {
    return apiRequest(
        `/profesores/${profesorId}/iglesias/${iglesiaId}/desactivar`,
        {
            method: 'PATCH',
        }
    )
}