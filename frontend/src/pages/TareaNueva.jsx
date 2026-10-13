import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getClases } from '../services/claseService'
import { createTarea } from '../services/tareaService'

export default function TareaNueva() {
    const navigate = useNavigate()

    const [clases, setClases] = useState([])
    const [claseId, setClaseId] = useState('')
    const [titulo, setTitulo] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [fechaEntrega, setFechaEntrega] = useState('')
    const [estado, setEstado] = useState('pendiente')

    const [cargandoClases, setCargandoClases] = useState(true)
    const [guardando, setGuardando] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        let cancelado = false

        async function cargarClases() {
            try {
                const data = await getClases()

                if (!cancelado) {
                    const lista = Array.isArray(data) ? data : data?.data || []
                    setClases(lista)
                }
            } catch (err) {
                if (!cancelado) {
                    setError(err.message || 'No se pudieron cargar las clases.')
                }
            } finally {
                if (!cancelado) {
                    setCargandoClases(false)
                }
            }
        }

        cargarClases()

        return () => {
            cancelado = true
        }
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')

        if (!claseId) {
            setError('Selecciona una clase.')
            return
        }

        if (!titulo.trim()) {
            setError('El título es obligatorio.')
            return
        }

        try {
            setGuardando(true)

            await createTarea({
                clase_id: Number(claseId),
                titulo: titulo.trim(),
                descripcion: descripcion.trim() || null,
                fecha_entrega: fechaEntrega || null,
                estado,
            })

            navigate('/tareas')
        } catch (err) {
            setError(err.message || 'No se pudo registrar la tarea.')
        } finally {
            setGuardando(false)
        }
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
                    Nueva tarea
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Registra una actividad y asígnala a una clase.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-6 rounded-xl border border-gray-200 bg-white p-6"
            >
                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div>
                    <label
                        htmlFor="claseId"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Clase <span className="text-red-500">*</span>
                    </label>

                    {cargandoClases ? (
                        <p className="text-sm text-gray-500">Cargando clases...</p>
                    ) : (
                        <select
                            id="claseId"
                            value={claseId}
                            onChange={(e) => setClaseId(e.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="">Selecciona una clase</option>

                            {clases.map((clase) => (
                                <option key={clase.id} value={clase.id}>
                                    {clase.alumno_nombre || 'Alumno sin nombre'}
                                    {' · '}
                                    {clase.instrumento_nombre || 'Instrumento'}
                                    {' · '}
                                    {clase.fecha || 'Sin fecha'}
                                    {' · '}
                                    {String(clase.hora_inicio || '').slice(0, 5)}
                                </option>
                            ))}
                        </select>
                    )}

                    {!cargandoClases && clases.length === 0 && (
                        <p className="mt-2 text-sm text-amber-700">
                            No hay clases disponibles. Registra una clase antes de crear una tarea.
                        </p>
                    )}
                </div>

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
                        placeholder="Ej. Practicar escalas mayores"
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
                        placeholder="Describe los ejercicios o indicaciones para el alumno..."
                        className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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

                    <div>
                        <label
                            htmlFor="estado"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Estado inicial
                        </label>

                        <select
                            id="estado"
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="pendiente">Pendiente</option>
                            <option value="en_progreso">En progreso</option>
                            <option value="completada">Completada</option>
                            <option value="cancelada">Cancelada</option>
                        </select>
                    </div>
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
                        disabled={guardando || cargandoClases || clases.length === 0}
                        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {guardando ? 'Guardando...' : 'Guardar tarea'}
                    </button>
                </div>
            </form>
        </div>
    )
}