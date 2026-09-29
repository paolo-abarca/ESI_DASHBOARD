import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProfesorById } from '../services/profesorService'
import { useAuth } from '../hooks/useAuth'

function ProfesorPerfil() {
    const { profesorId } = useParams()
    const navigate = useNavigate()
    const { profesor: profesorActual } = useAuth()

    const [profesor, setProfesor] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const esPropietario =
        profesorActual &&
        Number(profesorActual.id) === Number(profesorId)

    useEffect(() => {
        async function loadProfesor() {
            try {
                setLoading(true)
                setError('')

                const data = await getProfesorById(profesorId)
                setProfesor(data)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        loadProfesor()
    }, [profesorId])

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                <p className="text-slate-600">
                    Cargando perfil...
                </p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-100 p-6">
                <div className="mx-auto max-w-3xl">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="mb-6 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    >
                        ← Volver al dashboard
                    </button>

                    <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
                        {error}
                    </div>
                </div>
            </div>
        )
    }

    if (!profesor) {
        return null
    }

    const iniciales = `${profesor.nombre?.charAt(0) || ''}${profesor.apellido?.charAt(0) || ''}`

    return (
        <div className="min-h-screen bg-slate-100">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-sm font-medium text-slate-600 hover:text-slate-900"
                    >
                        ← Dashboard
                    </button>

                    {esPropietario && (
                        <button
                            onClick={() => navigate(`/profesores/${profesorId}/editar`)}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                        >
                            Editar perfil
                        </button>
                    )}
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                    <div className="bg-slate-900 px-6 py-10 sm:px-8">
                        <div className="flex flex-col items-center gap-5 sm:flex-row">
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-700">
                                {iniciales.toUpperCase()}
                            </div>

                            <div className="text-center sm:text-left">
                                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                                    <h1 className="text-3xl font-bold text-white">
                                        {profesor.nombre} {profesor.apellido}
                                    </h1>

                                    {esPropietario && (
                                        <span className="rounded-full bg-indigo-500 px-3 py-1 text-xs font-semibold text-white">
                                            Tu perfil
                                        </span>
                                    )}
                                </div>

                                <p className="mt-2 text-slate-300">
                                    Profesor
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8">
                        <h2 className="text-xl font-bold text-slate-900">
                            Información
                        </h2>

                        <div className="mt-6 grid gap-5 sm:grid-cols-2">
                            <div className="rounded-xl bg-slate-50 p-5">
                                <p className="text-sm text-slate-500">
                                    Nombre completo
                                </p>

                                <p className="mt-1 font-semibold text-slate-900">
                                    {profesor.nombre} {profesor.apellido}
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-5">
                                <p className="text-sm text-slate-500">
                                    Correo electrónico
                                </p>

                                <p className="mt-1 break-all font-semibold text-slate-900">
                                    {profesor.email}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h2 className="text-xl font-bold text-slate-900">
                                Instrumentos
                            </h2>

                            <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-6 text-center">
                                <p className="text-sm text-slate-500">
                                    Los instrumentos del profesor los conectaremos en el siguiente módulo.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h2 className="text-xl font-bold text-slate-900">
                                Iglesias
                            </h2>

                            <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-6 text-center">
                                <p className="text-sm text-slate-500">
                                    Las iglesias asociadas las conectaremos en el siguiente módulo.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ProfesorPerfil