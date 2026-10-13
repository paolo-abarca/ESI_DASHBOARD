import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getTareaById, updateTarea } from '../services/tareaService'

export default function TareaEditar() {
    const { tareaId } = useParams()
    const navigate = useNavigate()

    const [titulo, setTitulo] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [fechaEntrega, setFechaEntrega] = useState('')
    const [cargando, setCargando] = useState(true)
    const [guardando, setGuardando] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        let cancelado = false

        async function cargarTarea() {
            try {
                const respuesta = await getTareaById(tareaId)
                const tarea = respuesta?.data ?? respuesta

                if (!cancelado) {
                    setTitulo(tarea.titulo || '')
                    setDescripcion(tarea.descripcion || '')
                    setFechaEntrega(
                        tarea.fecha_entrega
                        ? String(tarea.fecha_entrega).slice(0, 10)
                        : ''
                    )
                }
            } catch (err) {
                if (!cancelado) {
                    setError(err.message || 'No se pudo cargar la tarea.')
                }
            } finally {
                if (!cancelado) {
                    setCargando(false)
                }
            }
        }

        cargarTarea()

        return () => {
            cancelado = true
        }
    }, [tareaId])

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')

        if (!titulo.trim()) {
            setError('El título es obligatorio.')
            return
        }

        try {
            setGuardando(true)

            await updateTarea(tareaId, {
                titulo: titulo.trim(),
                descripcion: descripcion.trim() || null,
                fecha_entrega: fechaEntrega || null,
            })

            navigate('/tareas')
        } catch (err) {
            setError(err.message || 'No se pudo actualizar la tarea.')
        } finally {
            setGuardando(false)
        }
    }

    if (cargando) {
        return (
            <p className="p-6 text-sm text-gray-500">
                Cargando tarea...
            </p>
        )
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div>
                <Link
                    to="/tareas"
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                    ← Volver a tareas
                </Link>

                <h1 className="mt-3 text-2xl font-bold text-gray-900">
                    Editar tarea
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Modifica los datos de la actividad.
                </p>
            </div>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            {!error || titulo ? (
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-xl border border-gray-200 bg-white p-6"
                >
                    <div>
                        <label
                            htmlFor="titulo"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Título <span className="text-red-500">*</span>
                        </label>

                        <input
                            id="titulo"
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            maxLength={150}
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="descripcion"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Descripción
                        </label>

                        <textarea
                            id="descripcion"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            rows={4}
                            className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="fechaEntrega"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Fecha de entrega
                        </label>

                        <input
                            id="fechaEntrega"
                            type="date"
                            value={fechaEntrega}
                            onChange={(e) => setFechaEntrega(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                        <Link
                            to="/tareas"
                            className="inline-flex justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        Cancelar
                        </Link>

                        <button
                            type="submit"
                            disabled={guardando}
                            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {guardando ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <p className="text-gray-700">No se pudo encontrar la tarea.</p>
                    <Link
                        to="/tareas"
                        className="mt-3 inline-block font-medium text-blue-600 hover:text-blue-800"
                    >
                        Volver a tareas
                    </Link>
                </div>
            )}
        </div>
    )
}