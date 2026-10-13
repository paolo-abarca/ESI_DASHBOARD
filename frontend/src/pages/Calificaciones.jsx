import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCalificaciones } from '../services/calificacionService'

const TIPOS = {
  practica: 'Práctica',
  evaluacion: 'Evaluación',
  parcial: 'Parcial',
  final: 'Final',
}

function formatearFecha(fecha) {
  if (!fecha) return '—'

  const fechaTexto = String(fecha).slice(0, 10)
  const [anio, mes, dia] = fechaTexto.split('-')

  if (!anio || !mes || !dia) return fechaTexto

  return `${dia}/${mes}/${anio}`
}

function formatearHora(hora) {
  if (!hora) return '—'
  return String(hora).slice(0, 5)
}

export default function Calificaciones() {
  const [calificaciones, setCalificaciones] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [tipoFiltro, setTipoFiltro] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  async function cargarCalificaciones() {
    try {
      setCargando(true)
      setError('')

      const data = await getCalificaciones()
      setCalificaciones(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'No se pudieron cargar las calificaciones.')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    let cancelado = false

    async function cargarDatos() {
      try {
        setError('')

        const data = await getCalificaciones()

        if (!cancelado) {
          setCalificaciones(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        if (!cancelado) {
          setError(
            err.message || 'No se pudieron cargar las calificaciones.'
          )
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

  const calificacionesFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()

    return calificaciones.filter((calificacion) => {
      const coincideBusqueda =
        !texto ||
        [
          calificacion.alumno_nombre,
          calificacion.profesor_nombre,
          calificacion.instrumento_nombre,
        ].some((valor) => String(valor || '').toLowerCase().includes(texto))

      const coincideTipo =
        !tipoFiltro || calificacion.tipo === tipoFiltro

      return coincideBusqueda && coincideTipo
    })
  }, [calificaciones, busqueda, tipoFiltro])

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Calificaciones
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Consulta las notas registradas de las clases.
          </p>
        </div>

        <Link
          to="/calificaciones/nueva"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + Nueva calificación
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Calificaciones registradas</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {calificaciones.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Resultados filtrados</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {calificacionesFiltradas.length}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por alumno, profesor o instrumento..."
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <select
          value={tipoFiltro}
          onChange={(e) => setTipoFiltro(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-56"
        >
          <option value="">Todos los tipos</option>
          {Object.entries(TIPOS).map(([valor, etiqueta]) => (
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
            onClick={cargarCalificaciones}
            className="mt-2 font-semibold underline"
          >
            Intentar nuevamente
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {cargando ? (
          <div className="p-10 text-center text-sm text-gray-500">
            Cargando calificaciones...
          </div>
        ) : calificacionesFiltradas.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-medium text-gray-700">
              No se encontraron calificaciones.
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Prueba con otros filtros o registra una nueva calificación.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-212.5 text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Alumno</th>
                  <th className="px-5 py-3 font-semibold">Instrumento</th>
                  <th className="px-5 py-3 font-semibold">Fecha de clase</th>
                  <th className="px-5 py-3 font-semibold">Horario</th>
                  <th className="px-5 py-3 font-semibold">Tipo</th>
                  <th className="px-5 py-3 font-semibold">Nota</th>
                  <th className="px-5 py-3 font-semibold">Profesor</th>
                  <th className="px-5 py-3 font-semibold">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {calificacionesFiltradas.map((calificacion) => (
                  <tr key={calificacion.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {calificacion.alumno_nombre || '—'}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {calificacion.instrumento_nombre || '—'}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {formatearFecha(calificacion.fecha)}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-gray-600">
                      {formatearHora(calificacion.hora_inicio)}
                      {' - '}
                      {formatearHora(calificacion.hora_fin)}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {TIPOS[calificacion.tipo] || calificacion.tipo || '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 font-semibold ${
                          Number(calificacion.nota) >= 11
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {calificacion.nota ?? '—'} / 20
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {calificacion.profesor_nombre || '—'}
                    </td>

                    <td className="px-5 py-4">
                      <Link
                        to={`/calificaciones/${calificacion.id}/editar`}
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