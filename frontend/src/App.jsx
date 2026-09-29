import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import ProfesorPerfil from './pages/ProfesorPerfil'
import ProfesorEditar from './pages/ProfesorEditar'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />

        <Route
          path="/profesores/:profesorId"
          element={
            <ProtectedRoute>
              <ProfesorPerfil />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profesores/:profesorId/editar"
          element={
            <ProtectedRoute>
              <ProfesorEditar />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App