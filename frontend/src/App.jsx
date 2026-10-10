import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import ProfesorPerfil from './pages/ProfesorPerfil'
import ProfesorEditar from './pages/ProfesorEditar'
import Alumnos from './pages/Alumnos'
import AlumnoNuevo from './pages/AlumnoNuevo'
import AlumnoPerfil from './pages/AlumnoPerfil'
import AlumnoEditar from './pages/AlumnoEditar'
import AlumnoInscripcionNueva from './pages/AlumnoInscripcionNueva'
import InscripcionEditar from './pages/InscripcionEditar'
import Clases from './pages/Clases'
import ClaseNueva from './pages/ClaseNueva'
import ClasePerfil from './pages/ClasePerfil'
import ClaseEditar from './pages/ClaseEditar'

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

        <Route
          path="/alumnos"
          element={
            <ProtectedRoute>
              <Alumnos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/alumnos/nuevo"
          element={
            <ProtectedRoute>
              <AlumnoNuevo />
            </ProtectedRoute>
          }
        />

        <Route
          path="/alumnos/:alumnoId"
          element={
            <ProtectedRoute>
              <AlumnoPerfil />
            </ProtectedRoute>
          }
        />

        <Route
          path="/alumnos/:alumnoId/editar"
          element={
            <ProtectedRoute>
              <AlumnoEditar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alumnos/:alumnoId/inscripciones/nueva"
          element={
            <ProtectedRoute>
              <AlumnoInscripcionNueva />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inscripciones/:inscripcionId/editar"
          element={
            <ProtectedRoute>
              <InscripcionEditar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clases"
          element={
            <ProtectedRoute>
              <Clases />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alumnos/:alumnoId/clases/nueva"
          element={
            <ProtectedRoute>
              <ClaseNueva />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clases/:claseId"
          element={
            <ProtectedRoute>
              <ClasePerfil />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clases/:claseId/editar"
          element={
            <ProtectedRoute>
              <ClaseEditar />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App