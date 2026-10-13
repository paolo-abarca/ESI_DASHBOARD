
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTareas, updateEstadoTarea } from '../services/tareaService'

const ESTADOS = {
    pendiente: 'Pendiente',
    en_progreso: 'En progreso',
    completada: 'Completada',
    cancelada: 'Cancelada',
}

function formatearFecha(fecha) {
    if (!fecha) return 'Sin fecha'

    const fechaTexto = String(fecha).slice(0, 10)
    const [anio, mes, dia] = fechaTexto.split('-')

    if (!anio || !mes || !dia) return fechaTexto

    return `${dia}/${mes}/${anio}`
}

function obtenerClaseEstado(estado) {
    switch (estado) {
        case 'completada':
            return 'bg-green-100 text-green-700'
        case 'en_progreso':
            return 'bg-blue-100 text-blue-700'
        case 'cancelada':
            return 'bg-gray-100 text-gray-600'
        default:
            return 'bg-amber-100 text-amber-700'
    }
}

export default function Tareas() {
    const [tareas, setTareas] = useState([])
    const [busqueda, setBusqueda] = useState('')
    const [estadoFiltro, setEstadoFiltro] = useState('')
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')
    const [actualizandoId, setActualizandoId] = useState(null)

    async function cargarTareas() {
        try {
            setCargando(true)
            setError('')

            const data = await getTareas()
            setTareas(Array.isArray(data) ? data : [])
        } catch (err) {
            setError(err.message || 'No se pudieron cargar las tareas.')
        } finally {
            setCargando(false)
        }
    }

    useEffect(() => {
        let cancelado = false

        async function cargarDatos() {
            try {
                const data = await getTareas()

                if (!cancelado) {
                    setTareas(Array.isArray(data) ? data : [])
                }
            } catch (err) {
                if (!cancelado) {
                    setError(err.message || 'No se pudieron cargar las tareas.')
                }
            } finally {
                if (!cancelado) {
                    setCargando(false)
                }
            }
        }

        cargarDatos()

        return () => {
            cancelado = true
        }
    }, [])

    const tareasFiltradas = useMemo(() => {
        const texto = busqueda.trim().toLowerCase()

        return tareas.filter((tarea) => {
            const coincideBusqueda =
            !texto ||
            [
                tarea.titulo,
                tarea.descripcion,
                tarea.alumno_nombre,
                tarea.profesor_nombre,
                tarea.instrumento_nombre,
            ].some((valor) =>
                String(valor || '').toLowerCase().includes(texto)
            )

            const coincideEstado =
            !estadoFiltro || tarea.estado === estadoFiltro

            return coincideBusqueda && coincideEstado
        })
    }, [tareas, busqueda, estadoFiltro])

    async function cambiarEstado(tareaId, nuevoEstado) {
        try {
            setActualizandoId(tareaId)
            setError('')

            const respuesta = await updateEstadoTarea(tareaId, nuevoEstado)
            const tareaActualizada = respuesta?.data ?? respuesta

            setTareas((anteriores) =>
                anteriores.map((tarea) =>
                    tarea.id === tareaId
                    ? { ...tarea, ...tareaActualizada }
                    : tarea
                )
            )
        } catch (err) {
            setError(err.message || 'No se pudo actualizar el estado.')
        } finally {
            setActualizandoId(null)
        }
    }

    const pendientes = tareas.filter(
        (tarea) => tarea.estado === 'pendiente'
    ).length

    const enProgreso = tareas.filter(
        (tarea) => tarea.estado === 'en_progreso'
    ).length

    const completadas = tareas.filter(
        (tarea) => tarea.estado === 'completada'
    ).length

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tareas</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Organiza las tareas y da seguimiento a las actividades de tus alumnos.
                    </p>
                </div>

                <Link
                    to="/tareas/nueva"
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    + Nueva tarea
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <p className="text-sm text-gray-500">Total de tareas</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">
                        {tareas.length}
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <p className="text-sm text-gray-500">Pendientes</p>
                    <p className="mt-2 text-2xl font-bold text-amber-600">
                        {pendientes}
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <p className="text-sm text-gray-500">En progreso</p>
                    <p className="mt-2 text-2xl font-bold text-blue-600">
                        {enProgreso}
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <p className="text-sm text-gray-500">Completadas</p>
                    <p className="mt-2 text-2xl font-bold text-green-600">
                        {completadas}
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
                <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar por título, alumno, profesor o instrumento..."
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <select
                    value={estadoFiltro}
                    onChange={(e) => setEstadoFiltro(e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-56"
                >
                    <option value="">Todos los estados</option>
                    {Object.entries(ESTADOS).map(([valor, etiqueta]) => (
                        <option key={valor} value={valor}>
                            {etiqueta}
                        </option>
                    ))}
                </select>
            </div>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <p>{error}</p>
                    <button
                        type="button"
                        onClick={cargarTareas}
                        className="mt-2 font-semibold underline"
                    >
                        Intentar nuevamente
                    </button>
                </div>
            )}

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                {cargando ? (
                    <div className="p-10 text-center text-sm text-gray-500">
                        Cargando tareas...
                    </div>
                ) : tareasFiltradas.length === 0 ? (
                    <div className="p-10 text-center">
                        <p className="font-medium text-gray-700">
                            No se encontraron tareas.
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                            Prueba con otros filtros o registra una nueva tarea.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-250 text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                <tr>
                                    <th className="px-5 py-3 font-semibold">Tarea</th>
                                    <th className="px-5 py-3 font-semibold">Alumno</th>
                                    <th className="px-5 py-3 font-semibold">Instrumento</th>
                                    <th className="px-5 py-3 font-semibold">Clase</th>
                                    <th className="px-5 py-3 font-semibold">Entrega</th>
                                    <th className="px-5 py-3 font-semibold">Estado</th>
                                    <th className="px-5 py-3 font-semibold">Acciones</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {tareasFiltradas.map((tarea) => (
                                    <tr key={tarea.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-4">
                                            <p className="font-medium text-gray-900">
                                                {tarea.titulo || '—'}
                                            </p>
                                            {tarea.descripcion && (
                                                <p className="mt-1 max-w-xs truncate text-xs text-gray-500">
                                                    {tarea.descripcion}
                                                </p>
                                            )}
                                        </td>

                                        <td className="px-5 py-4 text-gray-700">
                                            {tarea.alumno_nombre || '—'}
                                        </td>

                                        <td className="px-5 py-4 text-gray-600">
                                            {tarea.instrumento_nombre || '—'}
                                        </td>

                                        <td className="px-5 py-4 text-gray-600">
                                            {formatearFecha(tarea.clase_fecha)}
                                            <p className="mt-1 text-xs text-gray-500">
                                                {String(tarea.hora_inicio || '').slice(0, 5)}
                                                {' - '}
                                                {String(tarea.hora_fin || '').slice(0, 5)}
                                            </p>
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                                            {formatearFecha(tarea.fecha_entrega)}
                                        </td>

                                        <td className="px-5 py-4">
                                            <select
                                                value={tarea.estado}
                                                disabled={actualizandoId === tarea.id}
                                                onChange={(e) =>
                                                    cambiarEstado(tarea.id, e.target.value)
                                                }
                                                className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none disabled:opacity-50 ${obtenerClaseEstado(tarea.estado)}`}
                                            >
                                                {Object.entries(ESTADOS).map(([valor, etiqueta]) => (
                                                    <option key={valor} value={valor}>
                                                        {etiqueta}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4">
                                            <Link
                                                to={`/tareas/${tarea.id}/editar`}
                                                className="font-medium text-blue-600 hover:text-blue-800"
                                            >
                                                Editar
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}