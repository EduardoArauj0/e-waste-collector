import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import DashboardCliente from '../components/DashboardCliente';
import DashboardEmpresa from '../components/DashboardEmpresa';
import DashboardAdmin from '../components/DashboardAdmin';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser) {
        navigate('/');
      } else {
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Erro ao ler user do localStorage:', error);
      navigate('/');
    }
  }, [navigate]);

  if (!user) return <p className="text-center mt-10">Carregando dashboard...</p>;

  switch (user.tipo) {
    case 'cliente':
      return <DashboardCliente />;
    case 'empresa':
      return <DashboardEmpresa />;
    case 'admin':
      return <DashboardAdmin />;
    default:
      return <p className="text-center mt-10 text-red-600">Tipo de usuário inválido.</p>;
  }
}
