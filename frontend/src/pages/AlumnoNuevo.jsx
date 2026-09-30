import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { createAlumno } from '../services/alumnoService'
import { getIglesias } from '../services/iglesiaService'

function AlumnoNuevo() {
    const navigate = useNavigate()

    const [iglesias, setIglesias] = useState([])

    const [formulario, setFormulario] = useState({
        nombre: '',
        apellido: '',
        fecha_nacimiento: '',
        celular: '',
        genero: '',
        imagen: '',
        iglesia_id: '',
    })

    const [loadingIglesias, setLoadingIglesias] = useState(true)
    const [guardando, setGuardando] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        async function loadIglesias() {
            try {
                const data = await getIglesias()
                setIglesias(data)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoadingIglesias(false)
            }
        }

        loadIglesias()
    }, [])

    function handleChange(event) {
        const { name, value } = event.target

        setFormulario((actual) => ({
            ...actual,
            [name]: value,
        }))
    }

    async function handleSubmit(event) {
        event.preventDefault()

        try {
            setGuardando(true)
            setError('')

            await createAlumno({
                nombre: formulario.nombre,
                apellido: formulario.apellido,
                fecha_nacimiento:
                    formulario.fecha_nacimiento || null,
                celular: formulario.celular || null,
                genero: formulario.genero,
                imagen: formulario.imagen || null,
                iglesia_id: formulario.iglesia_id
                    ? Number(formulario.iglesia_id)
                    : null,
            })

            navigate('/alumnos')
        } catch (error) {
            setError(error.message)
        } finally {
            setGuardando(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
                    <button
                        onClick={() => navigate('/alumnos')}
                        className="text-sm font-medium text-slate-600 hover:text-slate-900"
                    >
                        ← Alumnos
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
                <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Nuevo alumno
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Registra los datos básicos del alumno.
                    </p>

                    {error && (
                        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="mt-8 space-y-5"
                    >
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">
                                    Nombre
                                </label>

                                <input
                                    type="text"
                                    name="nombre"
                                    value={formulario.nombre}
                                    onChange={handleChange}
                                    required
                                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">
                                    Apellido
                                </label>

                                <input
                                    type="text"
                                    name="apellido"
                                    value={formulario.apellido}
                                    onChange={handleChange}
                                    required
                                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                                />
                            </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">
                                    Fecha de nacimiento
                                </label>

                                <input
                                    type="date"
                                    name="fecha_nacimiento"
                                    value={formulario.fecha_nacimiento}
                                    onChange={handleChange}
                                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">
                                    Celular
                                </label>

                                <input
                                    type="text"
                                    name="celular"
                                    value={formulario.celular}
                                    onChange={handleChange}
                                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">
                                Género
                            </label>

                            <select
                                name="genero"
                                value={formulario.genero}
                                onChange={handleChange}
                                required
                                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            >
                                <option value="">Seleccionar...</option>
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">
                                Iglesia
                            </label>

                            <select
                                name="iglesia_id"
                                value={formulario.iglesia_id}
                                onChange={handleChange}
                                disabled={loadingIglesias}
                                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:bg-slate-100"
                            >
                                <option value="">
                                    {loadingIglesias
                                        ? 'Cargando iglesias...'
                                        : 'Sin iglesia'}
                                </option>

                                {iglesias.map((iglesia) => (
                                    <option
                                        key={iglesia.id}
                                        value={iglesia.id}
                                    >
                                        {iglesia.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">
                                Imagen
                            </label>

                            <input
                                type="text"
                                name="imagen"
                                value={formulario.imagen}
                                onChange={handleChange}
                                placeholder="URL de imagen"
                                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            />
                        </div>

                        <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => navigate('/alumnos')}
                                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
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
                                    : 'Crear alumno'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}

export default AlumnoNuevo