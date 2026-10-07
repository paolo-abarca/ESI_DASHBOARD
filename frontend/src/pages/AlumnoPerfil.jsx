import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
    getAlumnoById,
    deactivateAlumno,
} from '../services/alumnoService'

import {
    getInscripcionesByAlumno,
    deactivateInscripcion,
} from '../services/inscripcionService'

function AlumnoPerfil() {
    const { alumnoId } = useParams()
    const navigate = useNavigate()

    const [alumno, setAlumno] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [desactivando, setDesactivando] = useState(false)

    const [inscripciones, setInscripciones] = useState([])
    const [loadingInscripciones, setLoadingInscripciones] = useState(true)
    const [desactivandoInscripcion, setDesactivandoInscripcion] = useState(null)

    useEffect(() => {
        async function loadAlumno() {
            try {
                setLoading(true)
                setLoadingInscripciones(true)
                setError('')

                const [alumnoData, inscripcionesData] = await Promise.all([
                    getAlumnoById(alumnoId),
                    getInscripcionesByAlumno(alumnoId),
                ])

                setAlumno(alumnoData)
                setInscripciones(inscripcionesData)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
                setLoadingInscripciones(false)
            }
        }

        loadAlumno()
    }, [alumnoId])

    async function handleDesactivar() {
        const confirmar = window.confirm(
            '¿Deseas desactivar este alumno?'
        )

        if (!confirmar) return

        try {
            setDesactivando(true)
            setError('')

            await deactivateAlumno(alumnoId)

            navigate('/alumnos')
        } catch (error) {
            setError(error.message)
        } finally {
            setDesactivando(false)
        }
    }

    async function handleDesactivarInscripcion(inscripcionId) {
        const confirmar = window.confirm(
            '¿Deseas finalizar esta inscripción?'
        )

        if (!confirmar) return

        try {
            setDesactivandoInscripcion(inscripcionId)
            setError('')

            await deactivateInscripcion(inscripcionId)

            setInscripciones((actuales) =>
                actuales.filter(
                    (inscripcion) => inscripcion.id !== inscripcionId
                )
            )
        } catch (error) {
            setError(error.message)
        } finally {
            setDesactivandoInscripcion(null)
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                <p className="text-slate-600">
                    Cargando alumno...
                </p>
            </div>
        )
    }

    if (error && !alumno) {
        return (
            <div className="min-h-screen bg-slate-100 p-6">
                <div className="mx-auto max-w-3xl">
                    <button
                        onClick={() => navigate('/alumnos')}
                        className="mb-6 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    >
                        ← Volver a alumnos
                    </button>

                    <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
                        {error}
                    </div>
                </div>
            </div>
        )
    }

    if (!alumno) return null

    const iniciales =
        `${alumno.nombre?.charAt(0) || ''}${alumno.apellido?.charAt(0) || ''}`

    return (
        <div className="min-h-screen bg-slate-100">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
                    <button
                        onClick={() => navigate('/alumnos')}
                        className="text-sm font-medium text-slate-600 hover:text-slate-900"
                    >
                        ← Alumnos
                    </button>

                    <button
                        onClick={() =>
                            navigate(`/alumnos/${alumnoId}/editar`)
                        }
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                        Editar
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                    <div className="bg-slate-900 px-6 py-10 sm:px-8">
                        <div className="flex flex-col items-center gap-5 sm:flex-row">
                            {alumno.imagen ? (
                                <img
                                    src={alumno.imagen}
                                    alt={`${alumno.nombre} ${alumno.apellido}`}
                                    className="h-24 w-24 rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-700">
                                    {iniciales.toUpperCase()}
                                </div>
                            )}

                            <div className="text-center sm:text-left">
                                <h1 className="text-3xl font-bold text-white">
                                    {alumno.nombre} {alumno.apellido}
                                </h1>

                                <p className="mt-2 text-slate-300">
                                    Alumno
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8">
                        {error && (
                            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        <h2 className="text-xl font-bold text-slate-900">
                            Información
                        </h2>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-xl bg-slate-50 p-5">
                                <p className="text-sm text-slate-500">
                                    Nombre completo
                                </p>

                                <p className="mt-1 font-semibold text-slate-900">
                                    {alumno.nombre} {alumno.apellido}
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-5">
                                <p className="text-sm text-slate-500">
                                    Género
                                </p>

                                <p className="mt-1 font-semibold text-slate-900">
                                    {alumno.genero === 'M'
                                        ? 'Masculino'
                                        : 'Femenino'}
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-5">
                                <p className="text-sm text-slate-500">
                                    Fecha de nacimiento
                                </p>

                                <p className="mt-1 font-semibold text-slate-900">
                                    {alumno.fecha_nacimiento ||
                                        'No registrada'}
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-5">
                                <p className="text-sm text-slate-500">
                                    Celular
                                </p>

                                <p className="mt-1 font-semibold text-slate-900">
                                    {alumno.celular ||
                                        'No registrado'}
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-5 sm:col-span-2">
                                <p className="text-sm text-slate-500">
                                    Iglesia
                                </p>

                                <p className="mt-1 font-semibold text-slate-900">
                                    {alumno.iglesia_nombre ||
                                    'Sin iglesia'}
                                </p>
                            </div>
                        </div>

                        {/* INSCRIPCIONES */}
                        <div className="mt-10 border-t border-slate-200 pt-8">

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">
                                        Inscripciones
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Instrumentos y clases asignadas a este alumno.
                                    </p>
                                </div>

                                <button
                                    onClick={() =>
                                        navigate(`/alumnos/${alumnoId}/inscripciones/nueva`)
                                    }
                                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                >
                                    + Nueva inscripción
                                </button>
                            </div>

                            {loadingInscripciones && (
                                <div className="mt-5 rounded-xl bg-slate-50 p-6 text-center">
                                    <p className="text-sm text-slate-500">
                                        Cargando inscripciones...
                                    </p>
                                </div>
                            )}

                            {!loadingInscripciones && inscripciones.length === 0 && (
                                <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                                    <p className="font-medium text-slate-700">
                                        Este alumno no tiene inscripciones activas.
                                    </p>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Puedes crear una nueva inscripción desde este perfil.
                                    </p>
                                </div>
                            )}

                            {!loadingInscripciones && inscripciones.length > 0 && (
                                <div className="mt-5 space-y-4">
                                    {inscripciones.map((inscripcion) => (
                                        <div
                                            key={inscripcion.id}
                                            className="rounded-xl border border-slate-200 bg-slate-50 p-5"
                                        >
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="text-lg font-bold text-slate-900">
                                                            {inscripcion.instrumento_nombre}
                                                        </h3>

                                                        <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                                                            {inscripcion.tipo_clase === 'particular'
                                                                ? 'Particular'
                                                                : 'Grupal'}
                                                        </span>
                                                    </div>

                                                    <p className="mt-2 text-sm text-slate-600">
                                                        Profesor:{' '}
                                                        <span className="font-semibold text-slate-900">
                                                            {inscripcion.profesor_nombre}
                                                        </span>
                                                    </p>

                                                    <div className="mt-3 grid gap-2 text-sm text-slate-500 sm:grid-cols-2">
                                                        <p>
                                                            <span className="font-medium text-slate-700">
                                                                Inicio:
                                                            </span>{' '}
                                                            {inscripcion.fecha_inicio}
                                                        </p>

                                                        <p>
                                                            <span className="font-medium text-slate-700">
                                                                Fin:
                                                            </span>{' '}
                                                            {inscripcion.fecha_fin || 'Sin fecha'}
                                                        </p>
                                                    </div>

                                                    {inscripcion.observaciones && (
                                                        <p className="mt-3 text-sm text-slate-500">
                                                            <span className="font-medium text-slate-700">
                                                                Observaciones:
                                                            </span>{' '}
                                                            {inscripcion.observaciones}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    <button
                                                        onClick={() =>
                                                            navigate(   
                                                                `/alumnos/${alumnoId}/clases/nueva`
                                                            )
                                                        }
                                                        className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                                    >
                                                        + Nueva clase
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/inscripciones/${inscripcion.id}/editar`
                                                            )
                                                        }
                                                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                                                    >
                                                        Editar
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDesactivarInscripcion(
                                                                inscripcion.id
                                                            )
                                                        }
                                                        disabled={
                                                            desactivandoInscripcion ===
                                                            inscripcion.id
                                                        }
                                                        className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {desactivandoInscripcion ===
                                                        inscripcion.id
                                                            ? 'Finalizando...'
                                                            : 'Finalizar'}
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>

                        <div className="mt-8 border-t border-slate-200 pt-6">
                            <button
                                onClick={handleDesactivar}
                                disabled={desactivando}
                                className="rounded-lg px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {desactivando
                                    ? 'Desactivando...'
                                    : 'Desactivar alumno'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default AlumnoPerfil