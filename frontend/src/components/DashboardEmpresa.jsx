import { useEffect, useState } from 'react';
import axios from 'axios';
import LogoutButton from './LogoutButton';

export default function DashboardEmpresa() {
  const [pendentes, setPendentes] = useState([]);
  const [aceitos, setAceitos] = useState([]);
  const [loading, setLoading] = useState(true);

  const empresa = JSON.parse(localStorage.getItem('user'));

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const resPendentes = await axios.get('http://localhost:3000/discard-requests/pendentes');

      const resTodos = await axios.get('http://localhost:3000/discard-requests');

      const pedidosAceitos = resTodos.data.filter(p =>
        p.status === 'aceito' && p.companyId === empresa.id
      );

      setPendentes(resPendentes.data);
      setAceitos(pedidosAceitos);
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err);
    } finally {
      setLoading(false);
    }
  };

  const aceitarPedido = async (id) => {
    try {
      await axios.put(`http://localhost:3000/discard-requests/${id}`, {
        status: 'aceito',
        companyId: empresa.id
      });
      fetchPedidos();
    } catch (err) {
      console.error('Erro ao aceitar pedido:', err);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Dashboard da Empresa</h2>
        <LogoutButton />
      </div>

      <h3 className="text-lg font-semibold mb-2">Pedidos Pendentes</h3>
      {loading ? (
        <p>Carregando...</p>
      ) : pendentes.length === 0 ? (
        <p>Não há pedidos pendentes.</p>
      ) : (
        <div className="grid gap-4 mb-6">
          {pendentes.map(p => (
            <div key={p.id} className="border p-4 rounded-lg shadow">
              <p><strong>Tipo:</strong> {p.type}</p>
              <p><strong>Descrição:</strong> {p.description}</p>
              <p><strong>Cliente:</strong> {p.user?.name}</p>
              <p><strong>Endereço:</strong> {p.user?.street}, {p.user?.neighborhood}, {p.user?.city} - {p.user?.state}</p>
              <button
                className="mt-2 bg-green-600 text-white px-4 py-1 rounded"
                onClick={() => aceitarPedido(p.id)}
              >
                Aceitar pedido
              </button>
            </div>
          ))}
        </div>
      )}

      <h3 className="text-lg font-semibold mb-2">Pedidos Aceitos</h3>
      {aceitos.length === 0 ? (
        <p>Nenhum pedido aceito por você ainda.</p>
      ) : (
        <div className="grid gap-4">
          {aceitos.map(p => (
            <div key={p.id} className="border p-4 rounded-lg shadow">
              <p><strong>Tipo:</strong> {p.type}</p>
              <p><strong>Descrição:</strong> {p.description}</p>
              <p><strong>Status:</strong> {p.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
