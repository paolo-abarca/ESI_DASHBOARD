import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getAlumnos } from '../services/alumnoService'

function Alumnos() {
    const navigate = useNavigate()

    const [alumnos, setAlumnos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function loadAlumnos() {
            try {
                setLoading(true)
                setError('')

                const data = await getAlumnos()
                setAlumnos(data)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        loadAlumnos()
    }, [])

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                <p className="text-slate-600">Cargando alumnos...</p>
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
                        onClick={() => navigate('/alumnos/nuevo')}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                        + Nuevo alumno
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Alumnos
                    </h1>

                    <p className="mt-2 text-slate-600">
                        Gestión de alumnos registrados en el sistema.
                    </p>
                </div>

                {error && (
                    <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {alumnos.length === 0 ? (
                    <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                        <h2 className="text-lg font-semibold text-slate-900">
                            No hay alumnos
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Todavía no hay alumnos registrados.
                        </p>

                        <button
                            onClick={() => navigate('/alumnos/nuevo')}
                            className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                        >
                            Registrar primer alumno
                        </button>
                    </div>
                ) : (
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {alumnos.map((alumno) => {
                            const iniciales =
                                `${alumno.nombre?.charAt(0) || ''}${alumno.apellido?.charAt(0) || ''}`

                            return (
                                <button
                                    key={alumno.id}
                                    onClick={() =>
                                        navigate(`/alumnos/${alumno.id}`)
                                    }
                                    className="text-left rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
                                >
                                    <div className="flex items-center gap-4">
                                        {alumno.imagen ? (
                                            <img
                                                src={alumno.imagen}
                                                alt={`${alumno.nombre} ${alumno.apellido}`}
                                                className="h-14 w-14 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                                                {iniciales.toUpperCase()}
                                            </div>
                                        )}

                                        <div className="min-w-0">
                                            <h2 className="truncate font-bold text-slate-900">
                                                {alumno.nombre} {alumno.apellido}
                                            </h2>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {alumno.iglesia_nombre || 'Sin iglesia'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                                        <div className="flex justify-between gap-3 text-sm">
                                            <span className="text-slate-500">
                                                Género
                                            </span>

                                            <span className="font-medium text-slate-800">
                                                {alumno.genero === 'M'
                                                    ? 'Masculino'
                                                    : 'Femenino'}
                                            </span>
                                        </div>

                                        <div className="flex justify-between gap-3 text-sm">
                                            <span className="text-slate-500">
                                                Celular
                                            </span>

                                            <span className="font-medium text-slate-800">
                                                {alumno.celular || 'No registrado'}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                )}
            </main>
        </div>
    )
}

export default Alumnos