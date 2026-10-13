
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getClases } from '../services/claseService'
import { createCalificacion } from '../services/calificacionService'

const TIPOS = [
    { value: 'practica', label: 'Práctica' },
    { value: 'evaluacion', label: 'Evaluación' },
    { value: 'parcial', label: 'Parcial' },
    { value: 'final', label: 'Final' },
]

function formatearFecha(fecha) {
    if (!fecha) return ''

    const [anio, mes, dia] = String(fecha).slice(0, 10).split('-')

    return anio && mes && dia ? `${dia}/${mes}/${anio}` : fecha
}

function formatearHora(hora) {
    return hora ? String(hora).slice(0, 5) : ''
}

export default function CalificacionNueva() {
    const navigate = useNavigate()

    const [clases, setClases] = useState([])
    const [claseId, setClaseId] = useState('')
    const [tipo, setTipo] = useState('practica')
    const [nota, setNota] = useState('')
    const [cargandoClases, setCargandoClases] = useState(true)
    const [guardando, setGuardando] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        let cancelado = false

        async function cargarDatos() {
            try {
                const data = await getClases()

                const lista = Array.isArray(data)
                ? data
                : Array.isArray(data?.data)
                ? data.data
                : []

                if (!cancelado) {
                    setClases(lista)
                }
            } catch (err) {
                if (!cancelado) {
                    setError(err.message || 'No se pudieron cargar las clases.')
                }
            } finally {
                if (!cancelado) {
                    setCargandoClases(false)
                }
            }
        }

        cargarDatos()

        return () => {
            cancelado = true
        }
    }, [])

    const claseSeleccionada = clases.find(
        (clase) => String(clase.id) === claseId
    )

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')

        if (!claseSeleccionada) {
            setError('Selecciona una clase.')
            return
        }

        if (claseSeleccionada.inscripcion_id == null) {
            setError(
                'La clase seleccionada no contiene el identificador de su inscripción.'
            )
            return
        }

        const notaNumerica = Number(nota)

        if (nota === '' || !Number.isFinite(notaNumerica)) {
            setError('Ingresa una nota válida.')
            return
        }

        if (notaNumerica < 0 || notaNumerica > 20) {
            setError('La nota debe estar entre 0 y 20.')
            return
        }

        try {
            setGuardando(true)

            await createCalificacion({
                clase_id: Number(claseSeleccionada.id),
                inscripcion_id: Number(claseSeleccionada.inscripcion_id),
                tipo,
                nota: notaNumerica,
            })

            navigate('/calificaciones')
        } catch (err) {
            setError(err.message || 'No se pudo registrar la calificación.')
        } finally {
            setGuardando(false)
        }
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
                    Nueva calificación
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Registra una nota para una clase.
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

                <div>
                    <label
                        htmlFor="clase"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Clase
                    </label>

                    <select
                        id="clase"
                        value={claseId}
                        onChange={(e) => setClaseId(e.target.value)}
                        disabled={cargandoClases || guardando}
                        required
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                    >
                        <option value="">
                            {cargandoClases ? 'Cargando clases...' : 'Selecciona una clase'}
                        </option>

                        {clases.map((clase) => (
                            <option key={clase.id} value={clase.id}>
                                {[
                                    formatearFecha(clase.fecha),
                                    formatearHora(clase.hora_inicio),
                                    clase.alumno_nombre,
                                    clase.instrumento_nombre,
                                ]
                                .filter(Boolean)
                                .join(' · ')}
                            </option>
                        ))}
                    </select>

                    {!cargandoClases && clases.length === 0 && (
                        <p className="mt-2 text-sm text-amber-700">
                            No hay clases disponibles para seleccionar.
                        </p>
                    )}
                </div>

                {claseSeleccionada && (
                    <div className="rounded-lg bg-gray-50 p-4 text-sm">
                        <p className="font-medium text-gray-800">Clase seleccionada</p>
                        <p className="mt-2 text-gray-600">
                            Alumno: {claseSeleccionada.alumno_nombre || 'No disponible'}
                        </p>
                        <p className="mt-1 text-gray-600">
                            Instrumento: {claseSeleccionada.instrumento_nombre || 'No disponible'}
                        </p>
                        <p className="mt-1 text-gray-600">
                            Fecha: {formatearFecha(claseSeleccionada.fecha) || 'No disponible'}
                        </p>
                    </div>
                )}

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
                        placeholder="Ej. 17.5"
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
                        disabled={guardando || cargandoClases || clases.length === 0}
                        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {guardando ? 'Guardando...' : 'Registrar calificación'}
                    </button>
                </div>
            </form>
        </div>
    )
}