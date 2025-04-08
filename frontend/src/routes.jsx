import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import RegisterPage from './pages/Register';
import DashboardCliente from './pages/DashboardCliente';
import DashboardEmpresa from './pages/DashboardEmpresa';
import DashboardAdmin from './pages/DashboardAdmin';


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/dashboard/cliente" element={<DashboardCliente />} />
        <Route path="/dashboard/empresa" element={<DashboardEmpresa />} />
        <Route path="/dashboard/admin" element={<DashboardAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}
