import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { getProfesorById } from '../services/profesorService'
import {
    getInstrumentosByProfesor,
    assignInstrumento,
    deactivateInstrumento,
} from '../services/profesorInstrumentoService'
import { getInstrumentos } from '../services/instrumentService'

import {
    getIglesiasByProfesor,
    assignIglesia,
    deactivateIglesia,
} from '../services/profesorIglesiaService'
import { getIglesias } from '../services/iglesiaService'

import { useAuth } from '../hooks/useAuth'

function ProfesorPerfil() {
    const { profesorId } = useParams()
    const navigate = useNavigate()
    const { profesor: profesorActual } = useAuth()

    const [profesor, setProfesor] = useState(null)

    const [instrumentos, setInstrumentos] = useState([])
    const [catalogoInstrumentos, setCatalogoInstrumentos] = useState([])

    const [loading, setLoading] = useState(true)
    const [loadingInstrumentos, setLoadingInstrumentos] = useState(true)

    const [error, setError] = useState('')
    const [instrumentoError, setInstrumentoError] = useState('')
    const [instrumentoExito, setInstrumentoExito] = useState('')

    const [mostrarAgregar, setMostrarAgregar] = useState(false)
    const [instrumentoSeleccionado, setInstrumentoSeleccionado] =
        useState('')

    const [guardandoInstrumento, setGuardandoInstrumento] =
        useState(false)
    const [desactivandoInstrumento, setDesactivandoInstrumento] =
        useState(null)

    const [iglesias, setIglesias] = useState([])
    const [catalogoIglesias, setCatalogoIglesias] = useState([])

    const [loadingIglesias, setLoadingIglesias] = useState(true)

    const [iglesiaError, setIglesiaError] = useState('')
    const [iglesiaExito, setIglesiaExito] = useState('')

    const [mostrarAgregarIglesia, setMostrarAgregarIglesia] = useState(false)
    const [iglesiaSeleccionada, setIglesiaSeleccionada] = useState('')

    const [guardandoIglesia, setGuardandoIglesia] = useState(false)
    const [desactivandoIglesia, setDesactivandoIglesia] = useState(null)

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

    useEffect(() => {
        async function loadInstrumentos() {
            try {
                setLoadingInstrumentos(true)
                setInstrumentoError('')

                const data = await getInstrumentosByProfesor(profesorId)

                setInstrumentos(data)
            } catch (error) {
                setInstrumentoError(error.message)
            } finally {
                setLoadingInstrumentos(false)
            }
        }

        loadInstrumentos()
    }, [profesorId])

    useEffect(() => {
        async function loadIglesias() {
            try {
                setLoadingIglesias(true)
                setIglesiaError('')

                const data = await getIglesiasByProfesor(profesorId)
                setIglesias(data)
            } catch (error) {
                setIglesiaError(error.message)
            } finally {
                setLoadingIglesias(false)
            }
        }

        loadIglesias()
    }, [profesorId])

    useEffect(() => {
        async function loadCatalogoInstrumentos() {
            try {
                const data = await getInstrumentos()

                setCatalogoInstrumentos(data)
            } catch (error) {
                setInstrumentoError(error.message)
            }
        }

        loadCatalogoInstrumentos()
    }, [])

    useEffect(() => {
        async function loadCatalogoIglesias() {
            try {
                const data = await getIglesias()
                setCatalogoIglesias(data)
            } catch (error) {
                setIglesiaError(error.message)
            }
        }

        loadCatalogoIglesias()
    }, [])

    async function recargarInstrumentos() {
        const data = await getInstrumentosByProfesor(profesorId)

        setInstrumentos(data)
    }

    async function recargarIglesias() {
        const data = await getIglesiasByProfesor(profesorId)
        setIglesias(data)
    }

    async function handleAgregarInstrumento(event) {
        event.preventDefault()

        if (!instrumentoSeleccionado) {
            setInstrumentoError('Selecciona un instrumento.')
            return
        }

        try {
            setGuardandoInstrumento(true)
            setInstrumentoError('')
            setInstrumentoExito('')

            await assignInstrumento(
                profesorId,
                Number(instrumentoSeleccionado)
            )

            await recargarInstrumentos()

            setInstrumentoSeleccionado('')
            setMostrarAgregar(false)

            setInstrumentoExito(
                'Instrumento asignado correctamente.'
            )
        } catch (error) {
            setInstrumentoError(error.message)
        } finally {
            setGuardandoInstrumento(false)
        }
    }

    async function handleAgregarIglesia(event) {
        event.preventDefault()

        if (!iglesiaSeleccionada) {
            setIglesiaError('Selecciona una iglesia.')
            return
        }

        try {
            setGuardandoIglesia(true)
            setIglesiaError('')
            setIglesiaExito('')

            await assignIglesia(
                profesorId,
                Number(iglesiaSeleccionada)
            )

            await recargarIglesias()

            setIglesiaSeleccionada('')
            setMostrarAgregarIglesia(false)
            setIglesiaExito('Iglesia asignada correctamente.')
        } catch (error) {
            setIglesiaError(error.message)
        } finally {
            setGuardandoIglesia(false)
        }
    }

    async function handleDesactivarInstrumento(instrumentoId) {
        const confirmar = window.confirm(
            '¿Deseas quitar este instrumento del profesor?'
        )

        if (!confirmar) {
            return
        }

        try {
            setDesactivandoInstrumento(instrumentoId)
            setInstrumentoError('')
            setInstrumentoExito('')

            await deactivateInstrumento(
                profesorId,
                instrumentoId
            )

            await recargarInstrumentos()

            setInstrumentoExito(
                'Instrumento desactivado correctamente.'
            )
        } catch (error) {
            setInstrumentoError(error.message)
        } finally {
            setDesactivandoInstrumento(null)
        }
    }

    async function handleDesactivarIglesia(iglesiaId) {
        const confirmar = window.confirm(
            '¿Deseas quitar esta iglesia del profesor?'
        )

        if (!confirmar) return

        try {
            setDesactivandoIglesia(iglesiaId)
            setIglesiaError('')
            setIglesiaExito('')

            await deactivateIglesia(
                profesorId,
                iglesiaId
            )

            await recargarIglesias()

            setIglesiaExito(
                'Iglesia desactivada correctamente.'
            )
        } catch (error) {
            setIglesiaError(error.message)
        } finally {
            setDesactivandoIglesia(null)
        }
    }

    const instrumentosDisponibles =
        catalogoInstrumentos.filter(
            (instrumento) =>
                !instrumentos.some(
                    (actual) =>
                        Number(actual.id) === Number(instrumento.id)
                )
        )

    const iglesiasDisponibles = catalogoIglesias.filter(
        (iglesia) =>
            !iglesias.some(
                (actual) =>
                    Number(actual.id) === Number(iglesia.id)
            )
    )

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
                            onClick={() =>
                                navigate(`/profesores/${profesorId}/editar`)
                            }
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                        >
                            Editar perfil
                        </button>
                    )}
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

                    {/* CABECERA */}
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

                        {/* INFORMACIÓN */}
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

                        {/* INSTRUMENTOS */}
                        <div className="mt-8">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <h2 className="text-xl font-bold text-slate-900">
                                    Instrumentos
                                </h2>

                                {esPropietario && (
                                    <button
                                        onClick={() => {
                                            setMostrarAgregar((actual) => !actual)
                                            setInstrumentoError('')
                                            setInstrumentoExito('')
                                        }}
                                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                    >
                                        {mostrarAgregar
                                            ? 'Cancelar' 
                                            : '+ Agregar instrumento'}
                                    </button>
                                )}
                            </div>

                            {/* MENSAJE DE ERROR */}
                            {instrumentoError && (
                                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                    {instrumentoError}
                                </div>
                            )}

                            {/* MENSAJE DE ÉXITO */}
                            {instrumentoExito && (
                                <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                                    {instrumentoExito}
                                </div>
                            )}

                            {/* FORMULARIO AGREGAR */}
                            {esPropietario && mostrarAgregar && (
                                <form
                                    onSubmit={handleAgregarInstrumento}
                                    className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50 p-5"
                                >
                                    <label className="block text-sm font-medium text-slate-700">
                                        Selecciona un instrumento
                                    </label>

                                    <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                                        <select
                                            value={instrumentoSeleccionado}
                                            onChange={(event) =>
                                                setInstrumentoSeleccionado(
                                                    event.target.value
                                                )
                                            }
                                            className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                                        >
                                            <option value="">
                                                Seleccionar instrumento...
                                            </option>

                                            {instrumentosDisponibles.map(
                                                (instrumento) => (
                                                    <option
                                                        key={instrumento.id}
                                                        value={instrumento.id}
                                                    >
                                                        {instrumento.nombre}
                                                    </option>
                                                )
                                            )}
                                        </select>

                                        <button
                                            type="submit"
                                            disabled={guardandoInstrumento}
                                            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {guardandoInstrumento
                                                ? 'Guardando...'
                                                : 'Agregar'}
                                        </button>
                                    </div>

                                    {instrumentosDisponibles.length === 0 && (
                                        <p className="mt-3 text-sm text-slate-500">
                                            No hay más instrumentos disponibles para
                                            asignar.
                                        </p>
                                    )}
                                </form>
                            )}

                            {/* LISTA */}
                            <div className="mt-4">
                                {loadingInstrumentos ? (
                                    <div className="rounded-xl bg-slate-50 p-6 text-center">
                                        <p className="text-sm text-slate-500">
                                            Cargando instrumentos...
                                        </p>
                                    </div>
                                ) : instrumentos.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center">
                                        <p className="text-sm text-slate-500">
                                            Este profesor todavía no tiene instrumentos
                                            asignados.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {instrumentos.map((instrumento) => (
                                            <div
                                                key={instrumento.id}
                                                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4"
                                            >
                                                <div>
                                                    <p className="font-semibold text-slate-900">
                                                        {instrumento.nombre}
                                                    </p>
                                                </div>

                                                {esPropietario && (
                                                    <button
                                                        onClick={() =>
                                                            handleDesactivarInstrumento(
                                                                instrumento.id
                                                            )
                                                        }
                                                        disabled={
                                                            desactivandoInstrumento ===
                                                            instrumento.id
                                                        }
                                                        className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {desactivandoInstrumento ===
                                                        instrumento.id
                                                            ? 'Quitando...'
                                                            : 'Quitar'}
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* IGLESIAS */}
                        <div className="mt-8">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <h2 className="text-xl font-bold text-slate-900">
                                    Iglesias
                                </h2>

                                {esPropietario && (
                                    <button
                                        onClick={() => {
                                            setMostrarAgregarIglesia(
                                                (actual) => !actual
                                            )
                                            setIglesiaError('')
                                            setIglesiaExito('')
                                        }}
                                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                    >
                                        {mostrarAgregarIglesia
                                            ? 'Cancelar'
                                            : '+ Agregar iglesia'}
                                    </button>
                                )}
                            </div>

                            {iglesiaError && (
                                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                    {iglesiaError}
                                </div>
                            )}

                            {iglesiaExito && (
                                <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                                    {iglesiaExito}
                                </div>
                            )}

                            {esPropietario && mostrarAgregarIglesia && (
                                <form
                                    onSubmit={handleAgregarIglesia}
                                    className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50 p-5"
                                >
                                    <label className="block text-sm font-medium text-slate-700">
                                        Selecciona una iglesia
                                    </label>

                                    <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                                        <select
                                            value={iglesiaSeleccionada}
                                            onChange={(event) =>
                                                setIglesiaSeleccionada(
                                                    event.target.value
                                                )
                                            }
                                            className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                                        >
                                            <option value="">
                                                Seleccionar iglesia...
                                            </option>

                                            {iglesiasDisponibles.map((iglesia) => (
                                                <option
                                                    key={iglesia.id}
                                                    value={iglesia.id}
                                                >
                                                    {iglesia.nombre}
                                                </option>
                                            ))}
                                        </select>

                                        <button
                                            type="submit"
                                            disabled={guardandoIglesia}
                                            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {guardandoIglesia
                                                ? 'Guardando...'
                                                : 'Agregar'}
                                        </button>
                                    </div>

                                    {iglesiasDisponibles.length === 0 && (
                                        <p className="mt-3 text-sm text-slate-500">
                                            No hay más iglesias disponibles para
                                            asignar.
                                        </p>
                                    )}
                                </form>
                            )}

                            <div className="mt-4">
                                {loadingIglesias ? (
                                    <div className="rounded-xl bg-slate-50 p-6 text-center">
                                        <p className="text-sm text-slate-500">
                                            Cargando iglesias...
                                        </p>
                                    </div>
                                ) : iglesias.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center">
                                        <p className="text-sm text-slate-500">
                                            Este profesor todavía no tiene iglesias
                                            asociadas.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {iglesias.map((iglesia) => (
                                            <div
                                                key={iglesia.id}
                                                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <p className="font-semibold text-slate-900">
                                                            {iglesia.nombre}
                                                        </p>

                                                        {iglesia.direccion && (
                                                            <p className="mt-1 text-sm text-slate-500">
                                                                {iglesia.direccion}
                                                            </p>
                                                        )}

                                                        {iglesia.telefono && (
                                                            <p className="mt-1 text-sm text-slate-500">
                                                                Teléfono: {iglesia.telefono}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {esPropietario && (
                                                        <button
                                                            onClick={() =>
                                                                handleDesactivarIglesia(
                                                                    iglesia.id
                                                                )
                                                            }
                                                            disabled={
                                                                desactivandoIglesia ===
                                                                iglesia.id
                                                            }
                                                            className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            {desactivandoIglesia ===
                                                            iglesia.id
                                                                ? 'Quitando...'
                                                                : 'Quitar'}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    )
}

export default ProfesorPerfil