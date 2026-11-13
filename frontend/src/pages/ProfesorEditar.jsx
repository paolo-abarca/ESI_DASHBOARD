import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProfesorById, updateProfesor } from '../services/profesorService'
import {
    subirFotoProfesor,
    eliminarFotoProfesor
} from '../services/api'
import { useAuth } from '../hooks/useAuth'

function ProfesorEditar() {
    const { profesorId } = useParams()
    const navigate = useNavigate()
    const { profesor: profesorActual, setProfesor } = useAuth()

    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
    })

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [fotoUrl, setFotoUrl] = useState(null)
    const [archivoFoto, setArchivoFoto] = useState(null)
    const [eliminarFoto, setEliminarFoto] = useState(false)
    const [fotoOriginal, setFotoOriginal] = useState(null)

    const esPropietario =
        profesorActual &&
        Number(profesorActual.id) === Number(profesorId)

    useEffect(() => {
        async function loadProfesor() {
            try {
                setLoading(true)

                const data = await getProfesorById(profesorId)

                setFotoUrl(data.foto_url || null)
                setFotoOriginal(data.foto_url || null)
                setArchivoFoto(null)
                setEliminarFoto(false)

                setForm({
                    nombre: data.nombre || '',
                    apellido: data.apellido || '',
                    email: data.email || '',
                    password: '',
                })
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        loadProfesor()
    }, [profesorId])

    useEffect(() => {
        return () => {
            if (fotoUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(fotoUrl)
            }
        }
    }, [fotoUrl])

    function handleChange(event) {
        const { name, value } = event.target

        setForm((current) => ({
            ...current,
            [name]: value,
        }))

        setError('')
        setSuccess('')
    }

    function handleSubirFoto(event) {
        const archivo = event.target.files?.[0]
        event.target.value = ''

        if (!archivo) return

        const tiposPermitidos = [
            'image/jpeg',
            'image/png',
            'image/webp'
        ]

        if (!tiposPermitidos.includes(archivo.type)) {
            setError('Selecciona una imagen JPG, PNG o WEBP.')
            return
        }

        if (archivo.size > 5 * 1024 * 1024) {
            setError('La imagen no puede superar los 5 MB.')
            return
        }

        const vistaPrevia = URL.createObjectURL(archivo)

        setFotoUrl(vistaPrevia)
        setArchivoFoto(archivo)
        setEliminarFoto(false)
        setError('')
        setSuccess('')
    }

    function handleEliminarFoto() {
        setFotoUrl(null)
        setArchivoFoto(null)
        setEliminarFoto(true)
        setError('')
        setSuccess('')
    }

    async function handleSubmit(event) {
        event.preventDefault()

        setError('')
        setSuccess('')
        setSaving(true)

        try {
            const datos = {
                nombre: form.nombre,
                apellido: form.apellido,
                email: form.email,
            }

            if (form.password.trim()) {
                datos.password = form.password
            }

            // Primero guardamos los datos personales.
            const profesorActualizado = await updateProfesor(
                profesorId,
                datos,
            )

            // Después guardamos la operación pendiente de la fotografía.
            let nuevaFotoUrl = fotoOriginal

            if (archivoFoto) {
                const respuesta = await subirFotoProfesor(
                    profesorId,
                    archivoFoto
                )

                nuevaFotoUrl = respuesta.data.foto_url
            } else if (eliminarFoto) {
                await eliminarFotoProfesor(profesorId)
                nuevaFotoUrl = null
            }

            // Actualizamos el contexto si es nuestro perfil.
            if (esPropietario) {
                setProfesor({
                    ...profesorActual,
                    ...profesorActualizado,
                    foto_url: nuevaFotoUrl
                })
            }

            setFotoUrl(nuevaFotoUrl)
            setFotoOriginal(nuevaFotoUrl)
            setArchivoFoto(null)
            setEliminarFoto(false)

            setForm((current) => ({
                ...current,
                password: ''
            }))

            setSuccess('Perfil actualizado correctamente.')

        } catch (error) {
            setError(error.message)
        } finally {
            setSaving(false)
        }
    }

    if (!esPropietario) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
                <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
                    <h1 className="text-xl font-bold text-slate-900">
                        Acceso no permitido
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Solo puedes modificar tu propio perfil.
                    </p>

                    <button
                        onClick={() => navigate('/dashboard')}
                        className="mt-6 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
                    >
                        Volver al dashboard
                    </button>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                <p className="text-slate-600">
                    Cargando perfil...
                </p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-3xl items-center px-4 py-4 sm:px-6">
                    <button
                        onClick={() => navigate(`/profesores/${profesorId}`)}
                        className="text-sm font-medium text-slate-600 hover:text-slate-900"
                    >
                        ← Volver al perfil
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
                <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Editar perfil
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Actualiza tu información personal.
                        </p>
                    </div>

                    {error && (
                        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                            {success}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="mt-8 space-y-5"
                    >

                        <div className="flex flex-col items-center gap-4 border-b border-slate-200 pb-6 sm:flex-row">
                            <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-slate-100 bg-slate-200">
                                {fotoUrl ? (
                                    <img
                                        src={fotoUrl}
                                        alt="Fotografía del profesor"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-3xl font-bold text-slate-500">
                                        {form.nombre?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col items-center gap-2 sm:items-start">
                                <p className="font-semibold text-slate-800">
                                    Fotografía de perfil
                                </p>

                                <div className="flex flex-wrap justify-center gap-2">
                                    <label className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
                                        {fotoUrl ? 'Actualizar fotografía' : 'Subir fotografía'}

                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            className="hidden"
                                            onChange={handleSubirFoto}
                                        />
                                    </label>

                                    {fotoUrl && (
                                        <button
                                            type="button"
                                            onClick={handleEliminarFoto}
                                            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                                        >
                                            Eliminar
                                        </button>
                                    )}
                                </div>

                                <p className="text-xs text-slate-500">
                                    JPG, PNG o WEBP. Máximo 5 MB.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="nombre"
                                    className="mb-1 block text-sm font-medium text-slate-700"
                                >
                                    Nombre
                                </label>

                                <input
                                    id="nombre"
                                    name="nombre"
                                    type="text"
                                    value={form.nombre}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="apellido"
                                    className="mb-1 block text-sm font-medium text-slate-700"
                                >
                                    Apellido
                                </label>

                                <input
                                    id="apellido"
                                    name="apellido"
                                    type="text"
                                    value={form.apellido}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1 block text-sm font-medium text-slate-700"
                            >
                                Correo electrónico
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-1 block text-sm font-medium text-slate-700"
                            >
                                Nueva contraseña
                            </label>

                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Déjalo vacío para conservar la actual"
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />

                            <p className="mt-1 text-xs text-slate-500">
                                Solo completa este campo si deseas cambiar tu contraseña.
                            </p>
                        </div>

                        <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => navigate(`/profesores/${profesorId}`)}
                                className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving ? 'Guardando cambios...' : 'Guardar cambios'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}

export default ProfesorEditar