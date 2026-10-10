import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
    getClaseById,
    updateClase,
} from '../services/claseService'

function ClaseEditar() {
    const { claseId } = useParams()
    const navigate = useNavigate()

    const [clase, setClase] = useState(null)

    const [formulario, setFormulario] = useState({
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
        async function cargarClase() {
            try {
                setLoading(true)
                setError('')

                const data = await getClaseById(claseId)

                setClase(data)

                setFormulario({
                    fecha: data.fecha || '',
                    hora_inicio: data.hora_inicio || '',
                    hora_fin: data.hora_fin || '',
                    tema: data.tema || '',
                    observaciones: data.observaciones || '',
                })
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        cargarClase()
    }, [claseId])

    function handleChange(event) {
        const { name, value } = event.target

        setFormulario((actual) => ({
            ...actual,
            [name]: value,
        }))
    }

    async function handleSubmit(event) {
        event.preventDefault()

        if (!formulario.fecha) {
            setError('La fecha es obligatoria.')
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

            await updateClase(claseId, {
                fecha: formulario.fecha,
                hora_inicio: formulario.hora_inicio,
                hora_fin: formulario.hora_fin || null,
                tema: formulario.tema.trim() || null,
                observaciones:
                    formulario.observaciones.trim() || null,
            })

            navigate(`/clases/${claseId}`)
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
                    Cargando clase...
                </p>
            </div>
        )
    }

    if (!clase) {
        return (
            <div className="min-h-screen bg-slate-100 p-6">
                <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
                    <p className="text-red-600">
                        No se pudo cargar la clase.
                    </p>

                    <button
                        onClick={() => navigate('/clases')}
                        className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                    >
                        Volver
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-100 p-6">
            <div className="mx-auto max-w-3xl">
                <button
                    onClick={() => navigate(`/clases/${claseId}`)}
                    className="mb-6 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                >
                    ← Volver a la clase
                </button>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-slate-900">
                            Editar clase
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            {clase.alumno_nombre} ·{' '}
                            {clase.instrumento_nombre}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-700">
                                    Fecha
                                </label>

                                <input
                                    type="date"
                                    name="fecha"
                                    value={formulario.fecha}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-700">
                                    Hora de inicio
                                </label>

                                <input
                                    type="time"
                                    name="hora_inicio"
                                    value={formulario.hora_inicio}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-700">
                                    Hora de fin
                                </label>

                                <input
                                    type="time"
                                    name="hora_fin"
                                    value={formulario.hora_fin}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-semibold text-slate-700">
                                Tema
                            </label>

                            <input
                                type="text"
                                name="tema"
                                value={formulario.tema}
                                onChange={handleChange}
                                placeholder="Ej. Escalas mayores"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-semibold text-slate-700">
                                Observaciones
                            </label>

                            <textarea
                                name="observaciones"
                                value={formulario.observaciones}
                                onChange={handleChange}
                                rows={5}
                                placeholder="Observaciones de la clase..."
                                className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        <div className="flex flex-wrap gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={guardando}
                                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {guardando
                                    ? 'Guardando...'
                                    : 'Guardar cambios'}
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(`/clases/${claseId}`)
                                }
                                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ClaseEditar