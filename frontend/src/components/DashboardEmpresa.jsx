import { useEffect, useState } from 'react';
import axios from 'axios';
import LogoutButton from './LogoutButton';

export default function DashboardEmpresa() {
  const [pedidos, setPedidos] = useState([]);
  const [resposta, setResposta] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  const buscarPedidos = async () => {
    try {
      const res = await axios.get('http://localhost:3000/discardrequests');
      const pendentes = res.data.filter(pedido => pedido.status === 'pendente');
      setPedidos(pendentes);
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err);
    }
  };

  useEffect(() => {
    buscarPedidos();
  }, []);

  const aceitarPedido = async (id) => {
    try {
      await axios.put(`http://localhost:3000/discardrequests/${id}`, {
        status: 'aceito',
        companyId: user.id,
      });

      setResposta({ type: 'success', message: 'Pedido aceito com sucesso!' });
      buscarPedidos(); // atualiza a lista
    } catch (err) {
      console.error('Erro ao aceitar pedido:', err);
      setResposta({ type: 'error', message: 'Erro ao aceitar o pedido.' });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Dashboard Empresa</h2>
        <LogoutButton />
      </div>

      <h3 className="text-lg font-semibold mb-2">Pedidos pendentes:</h3>

      {resposta && (
        <p className={`mb-4 ${resposta.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {resposta.message}
        </p>
      )}

      {pedidos.length === 0 ? (
        <p>Nenhum pedido pendente no momento.</p>
      ) : (
        <ul className="space-y-4">
          {pedidos.map((pedido) => (
            <li key={pedido.id} className="border p-4 rounded shadow">
              <p><strong>Tipo:</strong> {pedido.type}</p>
              <p><strong>Descrição:</strong> {pedido.description}</p>
              <button
                className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
                onClick={() => aceitarPedido(pedido.id)}
              >
                Aceitar pedido
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
