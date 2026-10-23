import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../services/api'

function Registro() {
    const navigate = useNavigate()

    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        confirmarPassword: '',
    })

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    function handleChange(event) {
        const { name, value } = event.target

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    async function handleSubmit(event) {
        event.preventDefault()
        setError('')

        if (form.password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres.')
            return
        }

        if (form.password !== form.confirmarPassword) {
            setError('Las contraseñas no coinciden.')
            return
        }

        setLoading(true)

        try {
            await apiRequest('/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    nombre: form.nombre,
                    apellido: form.apellido,
                    email: form.email,
                    password: form.password,
                }),
            })

            navigate('/Login', {
                state: { registered: true },
            })
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const inputClass =
        'w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                <h1 className="text-3xl font-bold text-slate-900">
                    Crear cuenta
                </h1>

                <p className="mt-2 text-slate-500">
                    Regístrate como profesor en ESI Dashboard.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label htmlFor="nombre" className="mb-1 block text-sm font-medium text-slate-700">
                            Nombre
                        </label>
                        <input
                            id="nombre"
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            className={inputClass}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="apellido" className="mb-1 block text-sm font-medium text-slate-700">
                            Apellido
                        </label>
                        <input
                            id="apellido"
                            name="apellido"
                            value={form.apellido}
                            onChange={handleChange}
                            className={inputClass}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                            Correo electrónico
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="correo@ejemplo.com"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            className={inputClass}
                            minLength={8}
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmarPassword" className="mb-1 block text-sm font-medium text-slate-700">
                            Confirmar contraseña
                        </label>
                        <input
                            id="confirmarPassword"
                            name="confirmarPassword"
                            type="password"
                            value={form.confirmarPassword}
                            onChange={handleChange}
                            className={inputClass}
                            minLength={8}
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    {error && (
                        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
                    >
                        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/Login')}
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Volver a iniciar sesión
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Registro