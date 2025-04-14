import { useEffect, useState } from 'react';
import axios from 'axios';
import LogoutButton from './LogoutButton';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function DashboardAdmin() {
  const [clientes, setClientes] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [editandoStatusId, setEditandoStatusId] = useState(null);
  const [novoStatus, setNovoStatus] = useState('');
  const [openSection, setOpenSection] = useState(null);

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
      await axios.put(`http://localhost:3000/admin/pedido/${id}`, { status: novoStatus });
      fetchDados();
    } catch (err) {
      console.error('Erro ao atualizar status do pedido:', err);
    } finally {
      setProcessing(false);
    }
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Carregando...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-green-700">Painel Administrativo</h2>
        <LogoutButton />
      </div>

      {/* Clientes */}
      <div className="mb-6 border rounded-2xl shadow-sm">
        <div
          className="flex justify-between items-center cursor-pointer bg-green-100 px-4 py-3 rounded-t-2xl"
          onClick={() => toggleSection('clientes')}
        >
          <h3 className="text-xl font-semibold text-green-800">Clientes</h3>
          {openSection === 'clientes' ? <ChevronUp /> : <ChevronDown />}
        </div>
        {openSection === 'clientes' && (
          <div className="px-4 py-4 bg-white transition-all duration-300">
            {clientes.length === 0 ? (
              <p className="text-gray-500">Nenhum cliente cadastrado.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {clientes.map((cliente) => (
                  <div key={cliente.id} className="bg-gray-50 p-4 rounded-xl border shadow">
                    <p><strong>Nome:</strong> {cliente.name}</p>
                    <p><strong>Email:</strong> {cliente.email}</p>
                    <button
                      className="mt-3 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                      onClick={() => excluirCliente(cliente.id)}
                      disabled={processing}
                    >
                      Excluir Cliente
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Empresas */}
      <div className="mb-6 border rounded-2xl shadow-sm">
        <div
          className="flex justify-between items-center cursor-pointer bg-blue-100 px-4 py-3 rounded-t-2xl"
          onClick={() => toggleSection('empresas')}
        >
          <h3 className="text-xl font-semibold text-blue-800">Empresas</h3>
          {openSection === 'empresas' ? <ChevronUp /> : <ChevronDown />}
        </div>
        {openSection === 'empresas' && (
          <div className="px-4 py-4 bg-white transition-all duration-300">
            {empresas.length === 0 ? (
              <p className="text-gray-500">Nenhuma empresa cadastrada.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {empresas.map((empresa) => (
                  <div key={empresa.id} className="bg-gray-50 p-4 rounded-xl border shadow">
                    <p><strong>Nome:</strong> {empresa.name}</p>
                    <p><strong>Email:</strong> {empresa.email}</p>
                    <button
                      className="mt-3 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                      onClick={() => excluirEmpresa(empresa.id)}
                      disabled={processing}
                    >
                      Excluir Empresa
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pedidos */}
      <div className="mb-6 border rounded-2xl shadow-sm">
        <div
          className="flex justify-between items-center cursor-pointer bg-yellow-100 px-4 py-3 rounded-t-2xl"
          onClick={() => toggleSection('pedidos')}
        >
          <h3 className="text-xl font-semibold text-yellow-800">Pedidos</h3>
          {openSection === 'pedidos' ? <ChevronUp /> : <ChevronDown />}
        </div>
        {openSection === 'pedidos' && (
          <div className="px-4 py-4 bg-white transition-all duration-300">
            {pedidos.length === 0 ? (
              <p className="text-gray-500">Nenhum pedido registrado.</p>
            ) : (
              <div className="grid gap-4">
                {pedidos.map((pedido) => (
                  <div key={pedido.id} className="bg-gray-50 p-4 rounded-xl border shadow">
                    <p><strong>Tipo:</strong> {pedido.type}</p>
                    <p><strong>Descrição:</strong> {pedido.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <p><strong>Status:</strong></p>
                      {editandoStatusId === pedido.id ? (
                        <>
                          <select
                            className="border rounded px-2 py-1 mr-2"
                            value={novoStatus}
                            onChange={(e) => setNovoStatus(e.target.value)}
                            disabled={processing}
                          >
                            <option value="pendente">Pendente</option>
                            <option value="aceito">Aceito</option>
                            <option value="recusado">Recusado</option>
                            <option value="em andamento">Em Andamento</option>
                            <option value="concluído">Concluído</option>
                          </select>
                          <button
                            className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                            onClick={() => {
                              alterarStatusPedido(pedido.id, novoStatus);
                              setEditandoStatusId(null);
                            }}
                            disabled={processing}
                          >
                            Salvar
                          </button>
                        </>
                      ) : (
                        <>
                          <span>{pedido.status}</span>
                          <button
                            className="ml-2 text-blue-600 text-sm underline hover:text-blue-800"
                            onClick={() => {
                              setEditandoStatusId(pedido.id);
                              setNovoStatus(pedido.status);
                            }}
                          >
                            Editar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
