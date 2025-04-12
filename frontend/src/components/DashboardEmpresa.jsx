import { useEffect, useState } from 'react';
import axios from 'axios';
import LogoutButton from './LogoutButton';

export default function DashboardEmpresa() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchPedidosPendentes = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/discard-requests/pendentes');
      setPedidos(res.data);
    } catch (error) {
      console.error('Erro ao buscar pedidos pendentes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidosPendentes();
  }, []);

  const atualizarStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:3000/discard-requests/${id}`, {
        status,
        companyId: user.id,
      });
      fetchPedidosPendentes();
    } catch (error) {
      console.error(`Erro ao atualizar pedido ${id}:`, error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Dashboard Empresa</h2>
        <LogoutButton />
      </div>

      <h3 className="text-lg font-semibold mb-2">Pedidos Pendentes:</h3>

      {loading ? (
        <p>Carregando pedidos...</p>
      ) : pedidos.length === 0 ? (
        <p>Nenhum pedido pendente encontrado.</p>
      ) : (
        <div className="grid gap-4">
          {pedidos.map((pedido) => (
              <div key={pedido.id} className="bg-white p-4 rounded-lg shadow mb-4">
              <h2 className="text-lg font-bold">Pedido #{pedido.id}</h2>
              <p><strong>Cliente:</strong> {pedido.User?.name}</p>
              <p><strong>Local:</strong> {pedido.User?.street}, {pedido.User?.neighborhood}, {pedido.User?.city} - {pedido.User?.state}</p>
              <p><strong>Status:</strong> {pedido.status}</p>
              
              <p className="font-semibold">Tipo: {pedido.type}</p>
              <p>Descrição: {pedido.description}</p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => atualizarStatus(pedido.id, 'aceito')}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Aceitar
                </button>
                <button
                  onClick={() => atualizarStatus(pedido.id, 'recusado')}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Recusar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
