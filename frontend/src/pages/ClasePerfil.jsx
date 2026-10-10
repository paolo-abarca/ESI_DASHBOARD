import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
    getClaseById,
    deactivateClase,
} from '../services/claseService'

function ClasePerfil() {
    const { claseId } = useParams()
    const navigate = useNavigate()

    const [clase, setClase] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [desactivando, setDesactivando] = useState(false)

    useEffect(() => {
        async function cargarClase() {
            try {
                setLoading(true)
                setError('')

                const data = await getClaseById(claseId)

                setClase(data)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        cargarClase()
    }, [claseId])

    async function handleDesactivar() {
        const confirmar = window.confirm(
            '¿Deseas desactivar esta clase?'
        )

        if (!confirmar) return

        try {
            setDesactivando(true)
            setError('')

            await deactivateClase(claseId)

            navigate('/clases')
        } catch (error) {
            setError(error.message)
        } finally {
            setDesactivando(false)
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
                <div className="mx-auto max-w-3xl">
                    <button
                        onClick={() => navigate('/clases')}
                        className="mb-6 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    >
                        ← Volver a clases
                    </button>

                    <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
                        {error || 'No se pudo cargar la clase.'}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
                    <button
                        onClick={() => navigate('/clases')}
                        className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
                    >
                        ← Clases
                    </button>

                    <div className="flex gap-2">
                        <button
                            onClick={() =>
                                navigate(`/clases/${claseId}/editar`)
                            }
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                        >
                            Editar
                        </button>

                        <button
                            onClick={handleDesactivar}
                            disabled={desactivando}
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {desactivando
                                ? 'Desactivando...'
                                : 'Desactivar'}
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                    <div className="bg-slate-900 px-6 py-10 sm:px-8">
                        <p className="text-sm font-medium text-indigo-300">
                            Clase #{clase.id}
                        </p>

                        <h1 className="mt-2 text-3xl font-bold text-white">
                            {clase.alumno_nombre}
                        </h1>

                        <p className="mt-2 text-slate-300">
                            {clase.instrumento_nombre} ·{' '}
                            {clase.tipo_clase === 'particular'
                                ? 'Particular'
                                : 'Grupal'}
                        </p>
                    </div>

                    <div className="p-6 sm:p-8">
                        {error && (
                            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        <h2 className="text-xl font-bold text-slate-900">
                            Información de la clase
                        </h2>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-xl bg-slate-50 p-5">
                                <p className="text-sm text-slate-500">
                                    Alumno
                                </p>

                                <p className="mt-1 font-semibold text-slate-900">
                                    {clase.alumno_nombre}
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-5">
                                <p className="text-sm text-slate-500">
                                    Profesor
                                </p>

                                <p className="mt-1 font-semibold text-slate-900">
                                    {clase.profesor_nombre}
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-5">
                                <p className="text-sm text-slate-500">
                                    Instrumento
                                </p>

                                <p className="mt-1 font-semibold text-slate-900">
                                    {clase.instrumento_nombre}
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-5">
                                <p className="text-sm text-slate-500">
                                    Tipo de clase
                                </p>

                                <p className="mt-1 font-semibold text-slate-900">
                                    {clase.tipo_clase === 'particular'
                                        ? 'Particular'
                                        : 'Grupal'}
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-5">
                                <p className="text-sm text-slate-500">
                                    Fecha
                                </p>

                                <p className="mt-1 font-semibold text-slate-900">
                                    {clase.fecha}
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-5">
                                <p className="text-sm text-slate-500">
                                    Horario
                                </p>

                                <p className="mt-1 font-semibold text-slate-900">
                                    {clase.hora_inicio || 'Sin hora'}
                                    {clase.hora_fin &&
                                        ` - ${clase.hora_fin}`}
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-5 sm:col-span-2">
                                <p className="text-sm text-slate-500">
                                    Tema
                                </p>

                                <p className="mt-1 font-semibold text-slate-900">
                                    {clase.tema || 'Sin tema registrado'}
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-5 sm:col-span-2">
                                <p className="text-sm text-slate-500">
                                    Observaciones
                                </p>

                                <p className="mt-1 whitespace-pre-wrap text-slate-700">
                                    {clase.observaciones ||
                                        'Sin observaciones.'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-slate-200 pt-6">
                            <button
                                onClick={() =>
                                    navigate(
                                        `/alumnos/${clase.inscripcion_id}`
                                    )
                                }
                                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                            >
                                Ver información relacionada →
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ClasePerfil