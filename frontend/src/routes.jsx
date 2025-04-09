import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import RegisterPage from './pages/Register';
import DashboardPage from './pages/DashboardPage';
import DashboardCliente from './components/DashboardCliente';
import DashboardEmpresa from './components/DashboardEmpresa';
import DashboardAdmin from './components/DashboardAdmin';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/cliente" element={<DashboardCliente />} />
        <Route path="/dashboard/empresa" element={<DashboardEmpresa />} />
        <Route path="/dashboard/admin" element={<DashboardAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}
