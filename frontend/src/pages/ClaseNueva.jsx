import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { getAlumnoById } from '../services/alumnoService'
import { getInscripcionesByAlumno } from '../services/inscripcionService'
import { createClase } from '../services/claseService'

function ClaseNueva() {
    const { alumnoId } = useParams()
    const navigate = useNavigate()

    const [alumno, setAlumno] = useState(null)
    const [inscripciones, setInscripciones] = useState([])

    const [formulario, setFormulario] = useState({
        inscripcion_id: '',
        fecha: '',
        hora_inicio: '',
        hora_fin: '',
        tema: '',
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

                const [alumnoData, inscripcionesData] =
                    await Promise.all([
                        getAlumnoById(alumnoId),
                        getInscripcionesByAlumno(alumnoId),
                    ])

                setAlumno(alumnoData)
                setInscripciones(inscripcionesData)

                if (inscripcionesData.length === 1) {
                    setFormulario((actual) => ({
                        ...actual,
                        inscripcion_id: String(
                            inscripcionesData[0].id
                        ),
                    }))
                }
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        cargarDatos()
    }, [alumnoId])

    function handleChange(event) {
        const { name, value } = event.target

        setFormulario((actual) => ({
            ...actual,
            [name]: value,
        }))
    }

    async function handleSubmit(event) {
        event.preventDefault()

        if (!formulario.inscripcion_id) {
            setError('Debes seleccionar una inscripción.')
            return
        }

        if (!formulario.fecha) {
            setError('La fecha de la clase es obligatoria.')
            return
        }

        if (!formulario.hora_inicio) {
            setError('La hora de inicio es obligatoria.')
            return
        }

        if (
            formulario.hora_fin &&
            formulario.hora_fin <= formulario.hora_inicio
        ) {
            setError(
                'La hora de fin debe ser posterior a la hora de inicio.'
            )
            return
        }

        try {
            setGuardando(true)
            setError('')

            await createClase({
                inscripcion_id: Number(formulario.inscripcion_id),
                fecha: formulario.fecha,
                hora_inicio: formulario.hora_inicio,
                hora_fin: formulario.hora_fin || null,
                tema: formulario.tema.trim() || null,
                observaciones:
                    formulario.observaciones.trim() || null,
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
                    Cargando información...
                </p>
            </div>
        )
    }

    if (!alumno) {
        return (
            <div className="min-h-screen bg-slate-100 p-6">
                <div className="mx-auto max-w-3xl">
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
                        Nueva clase
                    </span>
                </div>
            </header>

            <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                    <div className="bg-slate-900 px-6 py-8 sm:px-8">
                        <p className="text-sm font-medium text-indigo-300">
                            Registrar clase
                        </p>

                        <h1 className="mt-2 text-2xl font-bold text-white">
                            Nueva clase
                        </h1>

                        <p className="mt-2 text-slate-300">
                            {alumno.nombre} {alumno.apellido}
                        </p>
                    </div>

                    <div className="p-6 sm:p-8">
                        {error && (
                            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        {inscripciones.length === 0 ? (
                            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                                <h2 className="font-bold text-amber-900">
                                    No hay inscripciones activas
                                </h2>

                                <p className="mt-2 text-sm text-amber-800">
                                    Este alumno necesita tener al menos
                                    una inscripción activa antes de
                                    registrar una clase.
                                </p>

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/alumnos/${alumnoId}/inscripciones/nueva`
                                        )
                                    }
                                    className="mt-4 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                >
                                    + Nueva inscripción
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label
                                        htmlFor="inscripcion_id"
                                        className="block text-sm font-semibold text-slate-700"
                                    >
                                        Inscripción
                                    </label>

                                    <select
                                        id="inscripcion_id"
                                        name="inscripcion_id"
                                        value={
                                            formulario.inscripcion_id
                                        }
                                        onChange={handleChange}
                                        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    >
                                        <option value="">
                                            Selecciona una inscripción
                                        </option>

                                        {inscripciones.map(
                                            (inscripcion) => (
                                                <option
                                                    key={
                                                        inscripcion.id
                                                    }
                                                    value={
                                                        inscripcion.id
                                                    }
                                                >
                                                    {inscripcion.instrumento_nombre}{' '}
                                                    —{' '}
                                                    {inscripcion.tipo_clase ===
                                                    'particular'
                                                        ? 'Particular'
                                                        : 'Grupal'}{' '}
                                                    — Prof.{' '}
                                                    {
                                                        inscripcion.profesor_nombre
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="fecha"
                                            className="block text-sm font-semibold text-slate-700"
                                        >
                                            Fecha
                                        </label>

                                        <input
                                            id="fecha"
                                            name="fecha"
                                            type="date"
                                            value={formulario.fecha}
                                            onChange={handleChange}
                                            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="hora_inicio"
                                            className="block text-sm font-semibold text-slate-700"
                                        >
                                            Hora de inicio
                                        </label>

                                        <input
                                            id="hora_inicio"
                                            name="hora_inicio"
                                            type="time"
                                            value={
                                                formulario.hora_inicio
                                            }
                                            onChange={handleChange}
                                            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="hora_fin"
                                            className="block text-sm font-semibold text-slate-700"
                                        >
                                            Hora de fin
                                            <span className="ml-1 font-normal text-slate-400">
                                                (opcional)
                                            </span>
                                        </label>

                                        <input
                                            id="hora_fin"
                                            name="hora_fin"
                                            type="time"
                                            value={formulario.hora_fin}
                                            onChange={handleChange}
                                            min={
                                                formulario.hora_inicio
                                            }
                                            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <label
                                        htmlFor="tema"
                                        className="block text-sm font-semibold text-slate-700"
                                    >
                                        Tema
                                        <span className="ml-1 font-normal text-slate-400">
                                            (opcional)
                                        </span>
                                    </label>

                                    <input
                                        id="tema"
                                        name="tema"
                                        type="text"
                                        value={formulario.tema}
                                        onChange={handleChange}
                                        placeholder="Ej. Escalas mayores"
                                        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    />
                                </div>

                                <div className="mt-6">
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
                                        value={
                                            formulario.observaciones
                                        }
                                        onChange={handleChange}
                                        rows={5}
                                        placeholder="Notas sobre el desarrollo de la clase..."
                                        className="mt-2 w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    />
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
                                            : 'Registrar clase'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ClaseNueva