import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import RegisterPage from './pages/Register';
import RecuperarSenha from "./pages/RecuperarSenha";
import DashboardPage from './pages/DashboardPage';
import EditarPerfil from './pages/EditarPerfil';
import DashboardCliente from './components/DashboardCliente';
import DashboardEmpresa from './components/DashboardEmpresa';
import DashboardAdmin from './components/DashboardAdmin';
import PrivateRoute from './components/PrivateRoute';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/editar-perfil" element={<EditarPerfil />} />

        {/* Rotas protegidas */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/cliente"
          element={
            <PrivateRoute>
              <DashboardCliente />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/empresa"
          element={
            <PrivateRoute>
              <DashboardEmpresa />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/admin"
          element={
            <PrivateRoute>
              <DashboardAdmin />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
