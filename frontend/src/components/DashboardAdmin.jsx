import { useEffect, useState } from 'react';
import axios from 'axios';
import LogoutButton from './LogoutButton';

export default function DashboardAdmin() {
  const [coletas, setColetas] = useState([]);

  useEffect(() => {
    const fetchAllColetas = async () => {
      try {
        const res = await axios.get('http://localhost:3000/discardrequests');
        setColetas(res.data);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
      }
    };

    fetchAllColetas();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Dashboard Admin</h2>
        <LogoutButton />
      </div>

      <h3 className="text-lg font-semibold mb-2">Todos os Pedidos de Coleta:</h3>
      {coletas.length === 0 ? (
        <p>Nenhum pedido registrado.</p>
      ) : (
        <ul className="list-disc ml-6">
          {coletas.map((coleta) => (
            <li key={coleta.id}>
              <strong>{coleta.type}</strong> - {coleta.description} ({coleta.status})
              <br />
              Criado por ID: {coleta.userId} {coleta.companyId && `| Aceito por: ${coleta.companyId}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
