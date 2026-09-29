import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { getProfesores } from '../services/profesorService'

function Dashboard() {
    const navigate = useNavigate()
    const { profesor, setProfesor } = useAuth()

    const [profesores, setProfesores] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function loadProfesores() {
            try {
                setLoading(true)
                setError('')

                const data = await getProfesores()
                setProfesores(data)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        loadProfesores()
    }, [])

    function handleLogout() {
        localStorage.removeItem('access_token')
        setProfesor(null)
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-slate-100">
            {/* HEADER */}
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7x1 items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">
                            ESI Dashboard
                        </h1>

                        <p className="text-sm text-slate-500">
                            Gestión académica
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-semibold text-slate-900">
                                {profesor?.nombre} {profesor?.apellido}
                            </p>

                            <p className="text-xs text-slate-500">
                                Profesor
                            </p>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700"
                        >
                            Salir
                        </button>
                    </div>
                </div>
            </header>

            {/* CONTENIDO */}
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <section>
                    <h2 className="text-3xl font-bold text-slate-900">
                        Bienvenido, {profesor?.nombre}
                    </h2>

                    <p className="mt-2 text-slate-600">
                        Selecciona un profesor para consultar su información.
                    </p>
                </section>

                <section className="mt-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-900">
                            Profesores
                        </h3>

                        {!loading && (
                            <span className="text-sm text-slate-500">
                                {profesores.length} profesores
                            </span>
                        )}
                    </div>

                    {loading && (
                        <div className="mt-6 rounded-xl bg-white p-8 text-center shadow-sm">
                            <p className="text-slate-500">
                                Cargando profesores...
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {!loading && !error && profesores.length === 0 && (
                        <div className="mt-6 rounded-xl bg-white p-8 text-center shadow-sm">
                            <p className="text-slate-500">
                                No hay profesores registrados.
                            </p>
                        </div>
                    )}

                    {!loading && !error && profesores.length > 0 && (
                        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {profesores.map((item) => {
                                const esActual = item.id === profesor?.id

                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => navigate(`/profesores/${item.id}`)}
                                        className="group rounded-2xl bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700">
                                                {item.nombre?.charAt(0).toUpperCase()}
                                                {item.apellido?.charAt(0).toUpperCase()}
                                            </div>

                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h4 className="font-bold text-slate-900">
                                                        {item.nombre} {item.apellido}
                                                    </h4>

                                                    {esActual && (
                                                        <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-700">
                                                            Tú
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="mt-1 truncate text-sm text-slate-500">
                                                    {item.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                                            <span className="text-sm font-medium text-slate-500">
                                                {esActual
                                                    ? 'Ver mi perfil'
                                                    : 'Ver perfil'}
                                            </span>

                                            <span className="text-indigo-600 transition group-hover:translate-x-1">
                                                →
                                            </span>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}

export default Dashboard