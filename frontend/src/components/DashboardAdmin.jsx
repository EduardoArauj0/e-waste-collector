import { useEffect, useState } from 'react';
import axios from 'axios';
import UserMenu from './UserMenu';
import PainelPedidos from './PainelPedidos';
import PainelClientes from './PainelClientes';
import PainelEmpresas from './PainelEmpresas';

export default function DashboardAdmin() {
  const [clientes, setClientes] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pedidos');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

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

  const salvarEdicao = async (id) => {
    try {
      await axios.put(`http://localhost:3000/admin/pedido/${id}`, editData);
      setEditingId(null);
      fetchDados();
    } catch (err) {
      console.error('Erro ao salvar edição:', err);
    }
  };

  const deletarPedido = async (id) => {
    if (!confirm('Tem certeza que deseja deletar este pedido?')) return;
    try {
      await axios.delete(`http://localhost:3000/admin/pedido/${id}`);
      fetchDados();
    } catch (err) {
      console.error('Erro ao deletar pedido:', err);
    }
  };

    const handleEditCliente = async (id, dadosAtualizados) => {
    try {
      const response = await axios.put(`http://localhost:3000/admin/cliente/${id}`, dadosAtualizados);
      const clienteAtualizado = response.data;
      setClientes(clientes.map(c => c.id === id ? clienteAtualizado : c));
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar cliente');
    }
  };

  const handleDeleteCliente = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/admin/cliente/${id}`);
      setClientes(clientes.filter(c => c.id !== id));
    } catch (error) {
      console.error(error);
      alert('Erro ao excluir cliente');
    }
  };

  const handleEditEmpresa = async (id, dadosAtualizados) => {
    try {
      const response = await fetch(`http://localhost:3000/admin/empresas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosAtualizados),
      });

      if (!response.ok) throw new Error('Erro ao atualizar empresa');
      const empresaAtualizada = await response.json();

      setEmpresas(empresas.map(e => e.id === id ? empresaAtualizada : e));
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar empresa');
    }
  };

  const handleDeleteEmpresa = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta empresa?')) return;
    try {
      const response = await fetch(`http://localhost:3000/admin/empresas/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao excluir empresa');

      setEmpresas(empresas.filter(e => e.id !== id));
    } catch (error) {
      console.error(error);
      alert('Erro ao excluir empresa');
    }
  };

  useEffect(() => {
    fetchDados();
  }, []);

  return (
    <div className="flex h-screen">
      <aside className="w-48 bg-gray-800 text-white p-4">
        <h2 className="text-lg font-bold mb-4">Admin</h2>
        <nav className="space-y-2">
          <button onClick={() => setActiveTab('pedidos')} className="block w-full text-left hover:text-green-400">Pedidos</button>
          <button onClick={() => setActiveTab('clientes')} className="block w-full text-left hover:text-green-400">Clientes</button>
          <button onClick={() => setActiveTab('empresas')} className="block w-full text-left hover:text-green-400">Empresas</button>
        </nav>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Admin</h2>
          <UserMenu />
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Carregando...</p>
        ) : (
          <div>
            {activeTab === 'pedidos' && (
              <PainelPedidos
                pedidos={pedidos}
                empresas={empresas}
                clientes={clientes}
                onEdit={salvarEdicao}
                onDelete={deletarPedido}
                editingId={editingId}
                editData={editData}
                setEditData={setEditData}
                setEditingId={setEditingId}
                salvarEdicao={salvarEdicao}
              />
            )}
            {activeTab === 'clientes' && (
              <PainelClientes
                clientes={clientes}
                onEdit={handleEditCliente}
                onDelete={handleDeleteCliente}
              />
            )}
            {activeTab === 'empresas' && (
              <PainelEmpresas
                empresas={empresas}
                onEdit={handleEditEmpresa}
                onDelete={handleDeleteEmpresa}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}