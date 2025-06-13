import { useEffect, useState } from 'react';
import axios from 'axios';
import LogoutButton from './LogoutButton';
import PainelPedidos from './PainelPedidos';
import PainelClientes from './PainelClientes';
import PainelEmpresas from './PainelEmpresas';

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-md w-full text-left
        transition-colors duration-200
        ${active ? 'bg-green-500 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

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
      const response = await axios.put(`http://localhost:3000/admin/empresas/${id}`, dadosAtualizados);
      const empresaAtualizada = response.data;

      setEmpresas(empresas.map(e => e.id === id ? empresaAtualizada : e));
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar empresa');
    }
  };

  const handleDeleteEmpresa = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta empresa?')) return;
    try {
      await axios.delete(`http://localhost:3000/admin/empresas/${id}`);
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
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-full md:w-56 bg-gray-900 text-gray-200 flex flex-col p-5 shadow-lg">
        <h2 className="text-2xl font-bold mb-8 text-white select-none">Admin</h2>

        <nav className="flex flex-col gap-3 flex-1">
          <TabButton
            active={activeTab === 'pedidos'}
            onClick={() => setActiveTab('pedidos')}
            label="Pedidos"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-6a2 2 0 012-2h6" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h6m-6 0v6a2 2 0 01-2 2H7" /></svg>}
          />
          <TabButton
            active={activeTab === 'clientes'}
            onClick={() => setActiveTab('clientes')}
            label="Clientes"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 12a4 4 0 10-8 0 4 4 0 008 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M17 8a4 4 0 110 8 4 4 0 010-8z" /></svg>}
          />
          <TabButton
            active={activeTab === 'empresas'}
            onClick={() => setActiveTab('empresas')}
            label="Empresas"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v4a1 1 0 001 1h3v5h2v-5h3v5h2v-5h3a1 1 0 001-1V7m-8 10v-4m0 0v-4m0 4h-4m4 0h4" /></svg>}
          />
        </nav>

        <div className="mt-6">
          <LogoutButton className="w-full bg-red-600 hover:bg-red-700 transition-colors rounded-md py-2 text-white font-semibold" />
        </div>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 p-6 overflow-auto">

        {loading ? (
          <p className="text-center text-gray-500 text-lg">Carregando...</p>
        ) : (
          <>
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
          </>
        )}
      </main>
    </div>
  );
}