import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
    getAlumnoById,
    deactivateAlumno,
} from '../services/alumnoService'

function AlumnoPerfil() {
    const { alumnoId } = useParams()
    const navigate = useNavigate()

    const [alumno, setAlumno] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [desactivando, setDesactivando] = useState(false)

    useEffect(() => {
        async function loadAlumno() {
            try {
                setLoading(true)
                setError('')

                const data = await getAlumnoById(alumnoId)
                setAlumno(data)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        loadAlumno()
    }, [alumnoId])

    async function handleDesactivar() {
        const confirmar = window.confirm(
            '¿Deseas desactivar este alumno?'
        )

        if (!confirmar) return

        try {
            setDesactivando(true)
            setError('')

            await deactivateAlumno(alumnoId)

            navigate('/alumnos')
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
                    Cargando alumno...
                </p>
            </div>
        )
    }

    if (error && !alumno) {
        return (
            <div className="min-h-screen bg-slate-100 p-6">
                <div className="mx-auto max-w-3xl">
                    <button
                        onClick={() => navigate('/alumnos')}
                        className="mb-6 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    >
                        ← Volver a alumnos
                    </button>

                    <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
                        {error}
                    </div>
                </div>
            </div>
        )
    }

    if (!alumno) return null

    const iniciales =
        `${alumno.nombre?.charAt(0) || ''}${alumno.apellido?.charAt(0) || ''}`

    return (
        <div className="min-h-screen bg-slate-100">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
                    <button
                        onClick={() => navigate('/alumnos')}
                        className="text-sm font-medium text-slate-600 hover:text-slate-900"
                    >
                        ← Alumnos
                    </button>

                    <button
                        onClick={() =>
                            navigate(`/alumnos/${alumnoId}/editar`)
                        }
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                        Editar
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                    <div className="bg-slate-900 px-6 py-10 sm:px-8">
                        <div className="flex flex-col items-center gap-5 sm:flex-row">
                            {alumno.imagen ? (
                                <img
                                    src={alumno.imagen}
                                    alt={`${alumno.nombre} ${alumno.apellido}`}
                                    className="h-24 w-24 rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-700">
                                    {iniciales.toUpperCase()}
                                </div>
                            )}

                            <div className="text-center sm:text-left">
                                <h1 className="text-3xl font-bold text-white">
                                    {alumno.nombre} {alumno.apellido}
                                </h1>

                                <p className="mt-2 text-slate-300">
                                    Alumno
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8">
                        {error && (
                            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        <h2 className="text-xl font-bold text-slate-900">
                            Información
                        </h2>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-xl bg-slate-50 p-5">
                                <p className="text-sm text-slate-500">
                                    Nombre completo
                                </p>

                                <p className="mt-1 font-semibold text-slate-900">
                                    {alumno.nombre} {alumno.apellido}
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-5">
                                <p className="text-sm text-slate-500">
                                    Género
                                </p>

                                <p className="mt-1 font-semibold text-slate-900">
                                    {alumno.genero === 'M'
                                        ? 'Masculino'
                                        : 'Femenino'}
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-5">
                                <p className="text-sm text-slate-500">
                                    Fecha de nacimiento
                                </p>

                                <p className="mt-1 font-semibold text-slate-900">
                                    {alumno.fecha_nacimiento ||
                                        'No registrada'}
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-5">
                                <p className="text-sm text-slate-500">
                                    Celular
                                </p>

                                <p className="mt-1 font-semibold text-slate-900">
                                    {alumno.celular ||
                                        'No registrado'}
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-5 sm:col-span-2">
                                <p className="text-sm text-slate-500">
                                    Iglesia
                                </p>

                                <p className="mt-1 font-semibold text-slate-900">
                                    {alumno.iglesia_nombre ||
                                    'Sin iglesia'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-slate-200 pt-6">
                            <button
                                onClick={handleDesactivar}
                                disabled={desactivando}
                                className="rounded-lg px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {desactivando
                                    ? 'Desactivando...'
                                    : 'Desactivar alumno'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default AlumnoPerfil