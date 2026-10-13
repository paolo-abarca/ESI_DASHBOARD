import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
    getCalificacionById,
    updateCalificacion,
} from '../services/calificacionService'

const TIPOS = [
    { value: 'practica', label: 'Práctica' },
    { value: 'evaluacion', label: 'Evaluación' },
    { value: 'parcial', label: 'Parcial' },
    { value: 'final', label: 'Final' },
]

function formatearFecha(fecha) {
    if (!fecha) return '—'

    const [anio, mes, dia] = String(fecha).slice(0, 10).split('-')
    return anio && mes && dia ? `${dia}/${mes}/${anio}` : fecha
}

export default function CalificacionEditar() {
    const { calificacionId } = useParams()
    const navigate = useNavigate()

    const [calificacion, setCalificacion] = useState(null)
    const [tipo, setTipo] = useState('practica')
    const [nota, setNota] = useState('')
    const [cargando, setCargando] = useState(true)
    const [guardando, setGuardando] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        let cancelado = false

        async function cargarCalificacion() {
            try {
                const data = await getCalificacionById(calificacionId)

                if (!cancelado) {
                    setCalificacion(data)
                    setTipo(data.tipo)
                    setNota(String(data.nota ?? ''))
                }
            } catch (err) {
                if (!cancelado) {
                    setError(err.message || 'No se pudo cargar la calificación.')
                }
            } finally {
                if (!cancelado) {
                    setCargando(false)
                }
            }
        }

        cargarCalificacion()

        return () => {
            cancelado = true
        }
    }, [calificacionId])

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')

        if (nota.trim() === '') {
            setError('Ingresa una nota.')
            return
        }

        const notaNumerica = Number(nota)

        if (
            !Number.isFinite(notaNumerica) ||
            notaNumerica < 0 ||
            notaNumerica > 20
        ) {
            setError('La nota debe estar entre 0 y 20.')
            return
        }

        try {
            setGuardando(true)

            await updateCalificacion(calificacionId, {
                tipo,
                nota: notaNumerica,
            })

            navigate('/calificaciones')
        } catch (err) {
            setError(err.message || 'No se pudo actualizar la calificación.')
        } finally {
            setGuardando(false)
        }
    }

    if (cargando) {
        return <p className="p-6 text-gray-500">Cargando calificación...</p>
    }

    if (!calificacion) {
        return (
            <div className="space-y-4 p-6">
                <p className="text-red-600">
                    {error || 'No se encontró la calificación.'}
                </p>
                <Link
                    to="/calificaciones"
                    className="font-medium text-blue-600 hover:underline"
                >
                    Volver a calificaciones
                </Link>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div>
                <Link
                    to="/calificaciones"
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                    ← Volver a calificaciones
                </Link>

                <h1 className="mt-3 text-2xl font-bold text-gray-900">
                    Editar calificación
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Modifica el tipo o la nota registrada.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-xl border border-gray-200 bg-white p-6"
            >
                {error && (
                    <div
                        role="alert"
                        className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                    >
                        {error}
                    </div>
                )}

                <div className="rounded-lg bg-gray-50 p-4 text-sm">
                    <p className="font-semibold text-gray-800">
                        {calificacion.alumno_nombre || 'Alumno no disponible'}
                    </p>
                    <p className="mt-1 text-gray-600">
                        Instrumento: {calificacion.instrumento_nombre || '—'}
                    </p>
                    <p className="mt-1 text-gray-600">
                        Fecha de clase: {formatearFecha(calificacion.fecha)}
                    </p>
                    <p className="mt-1 text-gray-600">
                        Profesor: {calificacion.profesor_nombre || '—'}
                    </p>
                </div>

                <div>
                    <label
                        htmlFor="tipo"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Tipo de calificación
                    </label>
                    <select
                        id="tipo"
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                        disabled={guardando}
                        required
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                        {TIPOS.map((opcion) => (
                            <option key={opcion.value} value={opcion.value}>
                                {opcion.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="nota"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Nota (de 0 a 20)
                    </label>
                    <input
                        id="nota"
                        type="number"
                        min="0"
                        max="20"
                        step="0.01"
                        value={nota}
                        onChange={(e) => setNota(e.target.value)}
                        disabled={guardando}
                        required
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                    <Link
                        to="/calificaciones"
                        className="rounded-lg border border-gray-300 px-4 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancelar
                    </Link>

                    <button
                        type="submit"
                        disabled={guardando}
                        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {guardando ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                </div>
            </form>
        </div>
    )
}