import { useLocation, useNavigate } from 'react-router-dom'
import {
    House,
    Church,
    UsersRound,
    CalendarDays,
    Settings,
} from 'lucide-react'

const items = [
    { label: 'Inicio', path: '/dashboard', icon: House },
    { label: 'Iglesias', path: '/iglesias', icon: Church },
    { label: 'Alumnos', path: '/alumnos', icon: UsersRound },
    { label: 'Calendario', path: '/calendario', icon: CalendarDays },
    { label: 'Configuración', path: '/configuracion', icon: Settings },
]

function Sidebar() {
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-950 text-white">
            <div className="flex h-20 shrink-0 items-center justify-center border-b border-slate-800 px-4">
                <h1 className="text-center text-xl font-bold tracking-wide">
                    ESI Dashboard
                </h1>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-6">
                {items.map((item) => {
                    const Icon = item.icon

                    const active =
                        location.pathname === item.path ||
                        location.pathname.startsWith(`${item.path}/`)

                    return (
                        <button
                            key={item.path}
                            type="button"
                            onClick={() => navigate(item.path)}
                            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                                active
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-white hover:bg-slate-800'
                            }`}
                        >
                            <Icon
                                size={22}
                                strokeWidth={1.8}
                                className="shrink-0 text-white"
                            />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    )
                })}
            </nav>
        </aside>
    )
}

export default Sidebar