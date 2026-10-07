import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
    getInscripcionById,
    updateInscripcion,
} from '../services/inscripcionService'

function InscripcionEditar() {
    const { inscripcionId } = useParams()
    const navigate = useNavigate()

    const [inscripcion, setInscripcion] = useState(null)

    const [formulario, setFormulario] = useState({
        fecha_inicio: '',
        fecha_fin: '',
        observaciones: '',
    })

    const [loading, setLoading] = useState(true)
    const [guardando, setGuardando] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        async function cargarInscripcion() {
            try {
                setLoading(true)
                setError('')

                const data = await getInscripcionById(inscripcionId)

                setInscripcion(data)

                setFormulario({
                    fecha_inicio: data.fecha_inicio || '',
                    fecha_fin: data.fecha_fin || '',
                    observaciones: data.observaciones || '',
                })
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        cargarInscripcion()
    }, [inscripcionId])

    function handleChange(event) {
        const { name, value } = event.target

        setFormulario((actual) => ({
            ...actual,
            [name]: value,
        }))
    }

    async function handleSubmit(event) {
        event.preventDefault()

        if (!formulario.fecha_inicio) {
            setError('La fecha de inicio es obligatoria.')
            return
        }

        if (
            formulario.fecha_fin &&
            formulario.fecha_fin < formulario.fecha_inicio
        ) {
            setError(
                'La fecha de fin no puede ser anterior a la fecha de inicio.'
            )
            return
        }

        try {
            setGuardando(true)
            setError('')

            await updateInscripcion(inscripcionId, {
                fecha_inicio: formulario.fecha_inicio,
                fecha_fin: formulario.fecha_fin || null,
                observaciones:
                    formulario.observaciones.trim() || null,
            })

            navigate(`/alumnos/${inscripcion.alumno_id}`)
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
                    Cargando inscripción...
                </p>
            </div>
        )
    }

    if (!inscripcion) {
        return (
            <div className="min-h-screen bg-slate-100 p-6">
                <div className="mx-auto max-w-2xl">
                    <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
                        {error || 'No se pudo cargar la inscripción.'}
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
                            navigate(
                                `/alumnos/${inscripcion.alumno_id}`
                            )
                        }
                        className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
                    >
                        ← Volver al alumno
                    </button>

                    <span className="text-sm font-semibold text-slate-500">
                        Editar inscripción
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
                            Editar inscripción
                        </h1>

                        <p className="mt-2 text-slate-300">
                            {inscripcion.alumno_nombre}
                        </p>
                    </div>

                    <div className="p-6 sm:p-8">
                        <div className="mb-6 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-xl bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">
                                    Instrumento
                                </p>
                                <p className="mt-1 font-semibold text-slate-900">
                                    {inscripcion.instrumento_nombre}
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">
                                    Tipo de clase
                                </p>
                                <p className="mt-1 font-semibold text-slate-900">
                                    {inscripcion.tipo_clase === 'particular'
                                        ? 'Particular'
                                        : 'Grupal'}
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2">
                                <p className="text-sm text-slate-500">
                                    Profesor
                                </p>
                                <p className="mt-1 font-semibold text-slate-900">
                                    {inscripcion.profesor_nombre}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {error && (
                                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            <div className="grid gap-6 sm:grid-cols-2">
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
                                        rows={5}
                                        placeholder="Información adicional..."
                                        className="mt-2 w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    />
                                </div>
                            </div>

                            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            `/alumnos/${inscripcion.alumno_id}`
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
                                        : 'Guardar cambios'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default InscripcionEditar