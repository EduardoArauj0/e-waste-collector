import { useEffect, useState } from 'react';
import axios from 'axios';
import UserMenu from "./UserMenu";

export default function DashboardEmpresa() {
  const [pendentes, setPendentes] = useState([]);
  const [aceitos, setAceitos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null); 
  const empresa = JSON.parse(localStorage.getItem('user'));

  const fetchPedidos = async () => {
    if (!empresa) return; 
    setLoading(true);
    try {
      const resPendentes = await axios.get('http://localhost:3000/discard-requests/pendentes');
      const resAceitos = await axios.get(`http://localhost:3000/discard-requests/empresa/${empresa.id}/aceitos`);

      setPendentes(resPendentes.data);
      setAceitos(resAceitos.data);
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (empresa) {
      fetchPedidos(); 
    }
  }, []); 

  const aceitarPedido = async (id) => {
    setProcessingId(id); 
    try {
      await axios.put(`http://localhost:3000/discard-requests/${id}`, {
        status: 'aceito',
        companyId: empresa.id
      });
      await fetchPedidos(); 
    } catch (err) {
      console.error('Erro ao aceitar pedido:', err);
    } finally {
      setProcessingId(null); 
    }
  };

  if (!empresa) {
    return <p>Erro: Empresa não logada.</p>; 
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Dashboard da Empresa</h2>
        <UserMenu />
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
              <p><strong>Endereço:</strong> {p.user?.street}, Nº {p.user?.number}, {p.user?.neighborhood}, {p.user?.city} - {p.user?.state}, CEP: {p.user?.cep}</p>
              <button
                className="mt-2 bg-green-600 text-white px-4 py-1 rounded disabled:opacity-50"
                onClick={() => aceitarPedido(p.id)}
                disabled={processingId === p.id}
              >
                {processingId === p.id ? 'Aceitando...' : 'Aceitar pedido'}
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
