import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { getAlumnoById } from '../services/alumnoService'
import { createInscripcion } from '../services/inscripcionService'
import { getInstrumentosByProfesor } from '../services/profesorInstrumentoService'
import { useAuth } from '../hooks/useAuth'

function AlumnoInscripcionNueva() {
    const { alumnoId } = useParams()
    const navigate = useNavigate()
    const { profesor } = useAuth()

    const [alumno, setAlumno] = useState(null)
    const [instrumentos, setInstrumentos] = useState([])

    const [formulario, setFormulario] = useState({
        profesor_instrumento_id: '',
        tipo_clase: 'particular',
        fecha_inicio: new Date().toISOString().split('T')[0],
        fecha_fin: '',
        observaciones: '',
    })

    const [loading, setLoading] = useState(true)
    const [guardando, setGuardando] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        async function cargarDatos() {
            try {
                setLoading(true)
                setError('')

                const [alumnoData, instrumentosData] = await Promise.all([
                    getAlumnoById(alumnoId),
                    getInstrumentosByProfesor(profesor.id),
                ])

                setAlumno(alumnoData)
                setInstrumentos(instrumentosData)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        if (profesor?.id) {
            cargarDatos()
        }
    }, [alumnoId, profesor])

    function handleChange(event) {
        const { name, value } = event.target

        setFormulario((actual) => ({
            ...actual,
            [name]: value,
        }))
    }

    async function handleSubmit(event) {
        event.preventDefault()

        if (!formulario.profesor_instrumento_id) {
            setError('Debes seleccionar un instrumento.')
            return
        }

        if (!formulario.fecha_inicio) {
            setError('La fecha de inicio es obligatoria.')
            return
        }

        try {
            setGuardando(true)
            setError('')

            await createInscripcion({
                alumno_id: Number(alumnoId),
                profesor_instrumento_id: Number(
                    formulario.profesor_instrumento_id
                ),
                tipo_clase: formulario.tipo_clase,
                fecha_inicio: formulario.fecha_inicio,
                fecha_fin: formulario.fecha_fin || null,
                observaciones: formulario.observaciones.trim() || null,
            })

            navigate(`/alumnos/${alumnoId}`)
        } catch (error) {
            setError(error.message)
        } finally {
            setGuardando(false)
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                <p className="text-slate-600">
                    Cargando...
                </p>
            </div>
        )
    }

    if (!alumno) {
        return (
            <div className="min-h-screen bg-slate-100 p-6">
                <div className="mx-auto max-w-2xl">
                    <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
                        {error || 'No se pudo cargar el alumno.'}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
                    <button
                        onClick={() =>
                            navigate(`/alumnos/${alumnoId}`)
                        }
                        className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
                    >
                        ← Volver al alumno
                    </button>

                    <span className="text-sm font-semibold text-slate-500">
                        Nueva inscripción
                    </span>
                </div>
            </header>

            <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                    <div className="bg-slate-900 px-6 py-8 sm:px-8">
                        <p className="text-sm font-medium text-indigo-300">
                            Inscripción
                        </p>

                        <h1 className="mt-2 text-2xl font-bold text-white">
                            Nueva inscripción
                        </h1>

                        <p className="mt-2 text-slate-300">
                            Asigna una clase a{' '}
                            <span className="font-semibold text-white">
                                {alumno.nombre} {alumno.apellido}
                            </span>
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="p-6 sm:p-8"
                    >
                        {error && (
                            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        {instrumentos.length === 0 ? (
                            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                                <h2 className="font-semibold text-amber-900">
                                    No tienes instrumentos asignados
                                </h2>

                                <p className="mt-1 text-sm text-amber-800">
                                    Para crear una inscripción necesitas
                                    tener al menos un instrumento asignado
                                    a tu perfil de profesor.
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            `/profesores/${profesor.id}`
                                        )
                                    }
                                    className="mt-4 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
                                >
                                    Ir a mi perfil
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="profesor_instrumento_id"
                                            className="block text-sm font-semibold text-slate-700"
                                        >
                                            Instrumento
                                        </label>

                                        <select
                                            id="profesor_instrumento_id"
                                            name="profesor_instrumento_id"
                                            value={
                                                formulario.profesor_instrumento_id
                                            }
                                            onChange={handleChange}
                                            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                        >
                                            <option value="">
                                                Selecciona un instrumento
                                            </option>

                                            {instrumentos.map(
                                                (instrumento) => (
                                                    <option
                                                        key={
                                                            instrumento.profesor_instrumento_id
                                                        }
                                                        value={
                                                            instrumento.profesor_instrumento_id
                                                        }
                                                    >
                                                        {instrumento.nombre}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="tipo_clase"
                                            className="block text-sm font-semibold text-slate-700"
                                        >
                                            Tipo de clase
                                        </label>

                                        <select
                                            id="tipo_clase"
                                            name="tipo_clase"
                                            value={formulario.tipo_clase}
                                            onChange={handleChange}
                                            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                        >
                                            <option value="particular">
                                                Particular
                                            </option>
                                            <option value="grupal">
                                                Grupal
                                            </option>
                                        </select>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="fecha_inicio"
                                            className="block text-sm font-semibold text-slate-700"
                                        >
                                            Fecha de inicio
                                        </label>

                                        <input
                                            id="fecha_inicio"
                                            name="fecha_inicio"
                                            type="date"
                                            value={formulario.fecha_inicio}
                                            onChange={handleChange}
                                            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="fecha_fin"
                                            className="block text-sm font-semibold text-slate-700"
                                        >
                                            Fecha de fin
                                            <span className="ml-1 font-normal text-slate-400">
                                                (opcional)
                                            </span>
                                        </label>

                                        <input
                                            id="fecha_fin"
                                            name="fecha_fin"
                                            type="date"
                                            value={formulario.fecha_fin}
                                            onChange={handleChange}
                                            min={formulario.fecha_inicio}
                                            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="observaciones"
                                            className="block text-sm font-semibold text-slate-700"
                                        >
                                            Observaciones
                                            <span className="ml-1 font-normal text-slate-400">
                                                (opcional)
                                            </span>
                                        </label>

                                        <textarea
                                            id="observaciones"
                                            name="observaciones"
                                            value={formulario.observaciones}
                                            onChange={handleChange}
                                            rows={4}
                                            placeholder="Información adicional sobre la inscripción..."
                                            className="mt-2 w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                        />
                                    </div>
                                </div>

                                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                `/alumnos/${alumnoId}`
                                            )
                                        }
                                        disabled={guardando}
                                        className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={guardando}
                                        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {guardando
                                            ? 'Guardando...'
                                            : 'Crear inscripción'}
                                    </button>
                                </div>
                            </>
                        )}
                    </form>
                </div>
            </main>
        </div>
    )
}

export default AlumnoInscripcionNueva