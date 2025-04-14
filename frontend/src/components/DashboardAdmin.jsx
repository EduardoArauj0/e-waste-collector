import { useEffect, useState } from 'react';
import axios from 'axios';
import LogoutButton from './LogoutButton';

export default function DashboardAdmin() {
  const [clientes, setClientes] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [editandoStatusId, setEditandoStatusId] = useState(null);
  
  const fetchDados = async () => {
    setLoading(true);
    try {
      const [resClientes, resEmpresas, resPedidos] = await Promise.all([
        axios.get('http://localhost:3000/admin/clientes'),
        axios.get('http://localhost:3000/admin/empresas'),
        axios.get('http://localhost:3000/admin/pedidos'),
      ]);

      setClientes(resClientes.data);
      setEmpresas(resEmpresas.data);
      setPedidos(resPedidos.data);
    } catch (err) {
      console.error('Erro ao buscar dados do admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDados();
  }, []);

  const excluirCliente = async (id) => {
    if (!confirm('Deseja excluir este cliente?')) return;
    setProcessing(true);
    try {
      await axios.delete(`http://localhost:3000/admin/clientes/${id}`);
      fetchDados();
    } catch (err) {
      console.error('Erro ao excluir cliente:', err);
    } finally {
      setProcessing(false);
    }
  };

  const excluirEmpresa = async (id) => {
    if (!confirm('Deseja excluir esta empresa?')) return;
    setProcessing(true);
    try {
      await axios.delete(`http://localhost:3000/admin/empresas/${id}`);
      fetchDados();
    } catch (err) {
      console.error('Erro ao excluir empresa:', err);
    } finally {
      setProcessing(false);
    }
  };

  const alterarStatusPedido = async (id, novoStatus) => {
    if (!novoStatus) return;
    setProcessing(true);
    try {
      await axios.put(`http://localhost:3000/admin/pedidos/${id}`, { status: novoStatus });
      fetchDados();
    } catch (err) {
      console.error('Erro ao atualizar status do pedido:', err);
    } finally {
      setProcessing(false);
    }
  };  

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Dashboard Admin</h2>
        <LogoutButton />
      </div>

      <h3 className="text-lg font-semibold mb-2">Clientes</h3>
      {clientes.length === 0 ? (
        <p>Nenhum cliente cadastrado.</p>
      ) : (
        <div className="grid gap-4 mb-6">
          {clientes.map((cliente) => (
            <div key={cliente.id} className="border p-4 rounded-lg shadow">
              <p><strong>Nome:</strong> {cliente.name}</p>
              <p><strong>Email:</strong> {cliente.email}</p>
              <button
                className="text-red-600 mt-2"
                onClick={() => excluirCliente(cliente.id)}
                disabled={processing}
              >
                Excluir Cliente
              </button>
            </div>
          ))}
        </div>
      )}

      <h3 className="text-lg font-semibold mb-2">Empresas</h3>
      {empresas.length === 0 ? (
        <p>Nenhuma empresa cadastrada.</p>
      ) : (
        <div className="grid gap-4 mb-6">
          {empresas.map((empresa) => (
            <div key={empresa.id} className="border p-4 rounded-lg shadow">
              <p><strong>Nome:</strong> {empresa.name}</p>
              <p><strong>Email:</strong> {empresa.email}</p>
              <button
                className="text-red-600 mt-2"
                onClick={() => excluirEmpresa(empresa.id)}
                disabled={processing}
              >
                Excluir Empresa
              </button>
            </div>
          ))}
        </div>
      )}

      <h3 className="text-lg font-semibold mb-2">Pedidos</h3>
      {pedidos.length === 0 ? (
        <p>Nenhum pedido registrado.</p>
      ) : (
        <div className="grid gap-4">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="border p-4 rounded-lg shadow">
              <p><strong>Tipo:</strong> {pedido.type}</p>
              <p><strong>Descrição:</strong> {pedido.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <p><strong>Status:</strong> {pedido.status}</p>
                {editandoStatusId === pedido.id ? (
                  <select
                    className="border rounded px-2 py-1"
                    value={pedido.status}
                    onChange={(e) => {
                      alterarStatusPedido(pedido.id, e.target.value);
                      setEditandoStatusId(null);
                    }}
                    disabled={processing}
                  >
                    <option value="pendente">Pendente</option>
                    <option value="em andamento">Em Andamento</option>
                    <option value="concluído">Concluído</option>
                  </select>
                ) : (
                  <button
                    className="text-blue-600 text-sm underline"
                    onClick={() => setEditandoStatusId(pedido.id)}
                  >
                    Alterar status
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
