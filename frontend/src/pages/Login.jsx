function Login() {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                <h1 className="text-3xl font-bold text-slate-900">
                    ESI Dashboard
                </h1>

                <p className="mt-2 text-slate-500">
                    Inicia sesión para continuar
                </p>

                <div className="mt-6 space-y-4">
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
                    />

                    <input
                        type="password"
                        placeholder="Contraseña"
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
                    />

                    <button
                        type="button"
                        className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700"
                    >
                        Iniciar sesión
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login