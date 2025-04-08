import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import RegisterPage from './pages/Register';
import DashboardCliente from './pages/DashboardCliente';



export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/dashboard-cliente" element={<DashboardCliente />} />
      </Routes>
    </BrowserRouter>
  );
}
