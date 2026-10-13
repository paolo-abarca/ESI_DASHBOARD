
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { getClaseById } from '../services/claseService'
import {
    getAlumnosByClase,
} from '../services/asistenciaService'
import {
    createAsistencia,
    updateAsistencia,
} from '../services/asistenciaService'

const ESTADOS = [
    { value: 'presente', label: 'Presente', color: 'bg-green-100 text-green-700' },
    { value: 'ausente', label: 'Ausente', color: 'bg-red-100 text-red-700' },
    { value: 'tarde', label: 'Tarde', color: 'bg-amber-100 text-amber-700' },
    { value: 'justificado', label: 'Justificado', color: 'bg-blue-100 text-blue-700' },
]

function ClaseAsistencia() {
    const { claseId } = useParams()
    const navigate = useNavigate()

    const [clase, setClase] = useState(null)
    const [alumnos, setAlumnos] = useState([])
    const [estados, setEstados] = useState({})
    const [loading, setLoading] = useState(true)
    const [guardandoId, setGuardandoId] = useState(null)
    const [error, setError] = useState('')
    const [mensaje, setMensaje] = useState('')

    const cargarDatos = useCallback(async () => {
        try {
            setLoading(true)
            setError('')

            const [claseData, alumnosData] = await Promise.all([
                getClaseById(claseId),
                getAlumnosByClase(claseId),
            ])

            setClase(claseData)
            setAlumnos(alumnosData)

            const estadosIniciales = {}

            alumnosData.forEach((alumno) => {
                estadosIniciales[alumno.inscripcion_id] =
                    alumno.estado_asistencia || 'presente'
            })

            setEstados(estadosIniciales)
        } catch (err) {
            setError(err.message || 'No se pudo cargar la asistencia.')
        } finally {
            setLoading(false)
        }
    }, [claseId])

    useEffect(() => {
        cargarDatos()
    }, [cargarDatos])

    function cambiarEstado(inscripcionId, estado) {
        setEstados((actuales) => ({
            ...actuales,
            [inscripcionId]: estado,
        }))
        setMensaje('')
    }

    async function guardarAsistencia(alumno) {
        const inscripcionId = alumno.inscripcion_id
        const estado = estados[inscripcionId]

        try {
            setGuardandoId(inscripcionId)
            setError('')
            setMensaje('')

            if (alumno.asistencia_id) {
                await updateAsistencia(alumno.asistencia_id, {
                    estado,
                })
            } else {
                await createAsistencia({
                    clase_id: Number(claseId),
                    inscripcion_id: inscripcionId,
                    estado,
                })
            }

            setMensaje(`Asistencia de ${alumno.alumno_nombre} guardada.`)
            await cargarDatos()
        } catch (err) {
            setError(err.message || 'No se pudo guardar la asistencia.')
        } finally {
            setGuardandoId(null)
        }
    }

    async function guardarTodas() {
        for (const alumno of alumnos) {
            await guardarAsistencia(alumno)
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                <p className="text-slate-600">Cargando asistencias...</p>
            </div>
        )
    }

    if (error && !clase) {
        return (
            <div className="min-h-screen bg-slate-100 p-6">
                <div className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-sm">
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={() => navigate('/clases')}
                        className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-white"
                    >
                        Volver a clases
                    </button>
                </div>
            </div>
        )
    }

    const registrados = alumnos.filter(
        (alumno) => alumno.asistencia_id
    ).length

    return (
        <div className="min-h-screen bg-slate-100 p-6">
            <div className="mx-auto max-w-5xl">
                <button
                    onClick={() => navigate(`/clases/${claseId}`)}
                    className="mb-6 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                >
                    ← Volver al perfil de la clase
                </button>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                Control de asistencia
                            </h1>
                            <p className="mt-2 text-slate-600">
                                {clase?.alumno_nombre}
                                {clase?.instrumento_nombre
                                    ? ` · ${clase.instrumento_nombre}`
                                    : ''}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                                Fecha: {clase?.fecha || 'Sin fecha'}
                            </p>
                        </div>

                        <div className="rounded-xl bg-indigo-50 px-4 py-3">
                            <p className="text-sm text-indigo-700">
                                Registros completados
                            </p>
                            <p className="text-2xl font-bold text-indigo-900">
                                {registrados} / {alumnos.length}
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {mensaje && (
                        <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                            {mensaje}
                        </div>
                    )}

                    {alumnos.length === 0 ? (
                        <div className="mt-8 rounded-xl border border-dashed border-slate-300 p-8 text-center">
                            <p className="font-semibold text-slate-700">
                                No hay alumnos para registrar.
                            </p>
                            <p className="mt-2 text-sm text-slate-500">
                                Verifica que la clase esté vinculada a una inscripción activa.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="mt-8 space-y-4">
                                {alumnos.map((alumno) => {
                                    const guardando =
                                        guardandoId === alumno.inscripcion_id

                                    const estadoActual =
                                        estados[alumno.inscripcion_id]

                                    const estadoInfo = ESTADOS.find(
                                        (item) => item.value === estadoActual
                                    )

                                    return (
                                        <div
                                            key={alumno.inscripcion_id}
                                            className="rounded-xl border border-slate-200 p-4"
                                        >
                                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                                <div>
                                                    <h3 className="font-bold text-slate-900">
                                                        {alumno.alumno_nombre}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-slate-500">
                                                        {alumno.instrumento_nombre}
                                                    </p>

                                                    <span
                                                        className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                            estadoInfo?.color || 'bg-slate-100 text-slate-700'
                                                        }`}
                                                    >
                                                        {alumno.asistencia_id
                                                            ? `Registrada: ${estadoInfo?.label || estadoActual}`
                                                            : 'Pendiente de registro'}
                                                    </span>
                                                </div>

                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                                    <select
                                                        value={estadoActual}
                                                        onChange={(event) =>
                                                            cambiarEstado(
                                                                alumno.inscripcion_id,
                                                                event.target.value
                                                            )
                                                        }
                                                        disabled={guardando}
                                                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
                                                    >
                                                        {ESTADOS.map((estado) => (
                                                            <option
                                                                key={estado.value}
                                                                value={estado.value}
                                                            >
                                                                {estado.label}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    <button
                                                        onClick={() =>
                                                            guardarAsistencia(alumno)
                                                        }
                                                        disabled={guardando}
                                                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {guardando
                                                            ? 'Guardando...'
                                                            : alumno.asistencia_id
                                                              ? 'Actualizar'
                                                              : 'Registrar'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={guardarTodas}
                                    disabled={guardandoId !== null}
                                    className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
                                >
                                    Guardar todas las asistencias
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ClaseAsistencia