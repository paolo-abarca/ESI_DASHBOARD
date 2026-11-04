import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { getProfesores } from '../services/profesorService'
import { UsersRound, ArrowRight } from 'lucide-react'
import { obtenerAlumnosPorProfesor } from '../services/api'

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

                const profesoresConConteos = await Promise.all(
                    data.map(async (item) => {
                        const respuesta = await obtenerAlumnosPorProfesor(item.id)

                        return {
                            ...item,
                            cantidad_alumnos: respuesta.data.length
                        }
                    })
                )

                setProfesores(profesoresConConteos)
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
            <header className="bg-slate-100">
                <div className="flex items-center justify-end gap-4 px-6 py-4 sm:px-8">
                    <span className="text-sm font-medium text-slate-700">
                        Profesor
                    </span>

                    <button
                        onClick={handleLogout}
                        className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700"
                    >
                        Salir
                    </button>
                </div>
            </header>

            {/* CONTENIDO */}
            <main className="mx-auto max-w-7xl px-12.5 pt-2 pb-8">
                <section>
                    <h2 className="text-3xl font-bold text-slate-900">
                        Bienvenido, {profesor?.nombre}
                    </h2>
                
                    <p className="mt-2 text-slate-600">
                        Selecciona un profesor para consultar su información.
                    </p>
                </section>

                <section className="mt-8">

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
                        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {profesores.map((item) => {
                                const esActual = item.id === profesor?.id
                                
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => navigate(`/profesores/${item.id}`)}
                                        className={`group w-full overflow-hidden rounded-3xl border-2 bg-white p-4 text-left shadow-sm shadow-slate-200/60 transition duration-200 hover:-translate-y-1 hover:shadow-lg ${
                                            esActual
                                                ? 'border-blue-500'
                                                : 'border-transparent'
                                        }`}
                                    >
                                        {/* Fotografía del profesor */}
                                        <div className="flex justify-center">
                                            <div className="h-48 w-full overflow-hidden rounded-2xl bg-slate-100">
                                                <img
                                                    src={
                                                        item.foto_url
                                                    }
                                                    alt={`${item.nombre} ${item.apellido}`}
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* Información */}
                                        <div className="px-1 pt-5">
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                                Profesor
                                            </p>
                                            
                                            <h4 className="mt-1 text-xl font-bold text-slate-900">
                                                {item.nombre} {item.apellido}
                                            </h4>
                
                                            {/* Cantidad de alumnos */}
                                            <div className="mt-4 flex items-center gap-2 text-blue-600">
                                                <UsersRound size={20} strokeWidth={2} />
                                                <span className="text-sm font-semibold">
                                                    {item.cantidad_alumnos ?? item.total_alumnos ?? 0} alumnos
                                                </span>
                                            </div>
                                        </div>
                
                                        {/* Acceso al perfil */}
                                        <div className="mt-5 flex items-center justify-between border-t border-slate-200 px-1 pt-4">
                                            <span className="text-sm font-semibold text-slate-600 transition group-hover:text-blue-600">
                                                {esActual ? 'Ver mi perfil' : 'Ver perfil'}
                                            </span>
                
                                            <ArrowRight
                                                size={18}
                                                className="text-blue-600 transition group-hover:translate-x-1"
                                            />
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