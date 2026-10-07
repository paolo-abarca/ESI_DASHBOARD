import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getClases } from '../services/claseService'

function Clases() {
    const navigate = useNavigate()

    const [clases, setClases] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function cargarClases() {
            try {
                setLoading(true)
                setError('')

                const data = await getClases()

                setClases(data)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        cargarClases()
    }, [])

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                <p className="text-slate-600">
                    Cargando clases...
                </p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
                    >
                        ← Dashboard
                    </button>

                    <button
                        onClick={() => navigate('/clases/nueva')}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                        + Nueva clase
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Clases
                    </h1>

                    <p className="mt-2 text-slate-600">
                        Gestiona las clases realizadas y programadas.
                    </p>
                </div>

                {error && (
                    <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {!error && clases.length === 0 && (
                    <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow-sm">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-2xl">
                            📚
                        </div>

                        <h2 className="mt-4 text-xl font-bold text-slate-900">
                            No hay clases registradas
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Cuando registres una clase aparecerá aquí.
                        </p>

                        <button
                            onClick={() => navigate('/clases/nueva')}
                            className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                        >
                            Registrar primera clase
                        </button>
                    </div>
                )}

                {clases.length > 0 && (
                    <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {clases.map((clase) => (
                            <button
                                key={clase.id}
                                onClick={() =>
                                    navigate(`/clases/${clase.id}`)
                                }
                                className="group rounded-2xl bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                                            {clase.fecha}
                                        </p>

                                        <h2 className="mt-2 text-lg font-bold text-slate-900">
                                            {clase.alumno_nombre ||
                                                'Alumno no disponible'}
                                        </h2>
                                    </div>

                                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                        Clase
                                    </span>
                                </div>

                                <div className="mt-5 space-y-2 text-sm text-slate-600">
                                    <p>
                                        <span className="font-semibold text-slate-800">
                                            Instrumento:
                                        </span>{' '}
                                        {clase.instrumento_nombre ||
                                            'No disponible'}
                                    </p>

                                    <p>
                                        <span className="font-semibold text-slate-800">
                                            Profesor:
                                        </span>{' '}
                                        {clase.profesor_nombre ||
                                            'No disponible'}
                                    </p>

                                    <p>
                                        <span className="font-semibold text-slate-800">
                                            Horario:
                                        </span>{' '}
                                        {clase.hora_inicio ||
                                            'Sin hora'}
                                        {clase.hora_fin &&
                                            ` - ${clase.hora_fin}`}
                                    </p>

                                    {clase.tema && (
                                        <p>
                                            <span className="font-semibold text-slate-800">
                                                Tema:
                                            </span>{' '}
                                            {clase.tema}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-5 border-t border-slate-100 pt-4 text-sm font-semibold text-indigo-600 transition group-hover:text-indigo-700">
                                    Ver clase →
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}

export default Clases