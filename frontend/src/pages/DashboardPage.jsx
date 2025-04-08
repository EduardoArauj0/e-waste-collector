import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import DashboardCliente from '../components/DashboardCliente';
import DashboardEmpresa from '../components/DashboardEmpresa';
import DashboardAdmin from '../components/DashboardAdmin';

export default function DashboardPage() {
  const navigate = useNavigate();

  // Pegamos o usuário do localStorage (ou sessionStorage, se preferir)
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return null;

  switch (user.tipo) {
    case 'cliente':
      return <DashboardCliente />;
    case 'empresa':
      return <DashboardEmpresa />;
    case 'admin':
      return <DashboardAdmin />;
    default:
      return <div>Tipo de usuário inválido</div>;
  }
}
