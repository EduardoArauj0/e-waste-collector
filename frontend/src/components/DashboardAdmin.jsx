import { useEffect, useState } from 'react';
import axios from 'axios';
import LogoutButton from './LogoutButton';

export default function DashboardAdmin() {
  const [clientes, setClientes] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDados = async () => {
    setLoading(true);
    try {
      const resClientes = await axios.get('http://localhost:3000/admin/clientes');
      const resEmpresas = await axios.get('http://localhost:3000/admin/empresas');
      const resPedidos = await axios.get('http://localhost:3000/admin/pedidos');

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

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Dashboard Admin</h2>
        <LogoutButton />
      </div>

      <h3 className="text-lg font-semibold mb-2">Clientes</h3>
      {clientes.map((cliente) => (
        <div key={cliente.id} className="border p-4 rounded-lg shadow">
          <p><strong>Nome:</strong> {cliente.name}</p>
          <p><strong>Email:</strong> {cliente.email}</p>
          <button className="text-red-600">Excluir Cliente</button>
        </div>
      ))}

      <h3 className="text-lg font-semibold mb-2">Empresas</h3>
      {empresas.map((empresa) => (
        <div key={empresa.id} className="border p-4 rounded-lg shadow">
          <p><strong>Nome:</strong> {empresa.name}</p>
          <p><strong>Email:</strong> {empresa.email}</p>
          <button className="text-red-600">Excluir Empresa</button>
        </div>
      ))}

      <h3 className="text-lg font-semibold mb-2">Pedidos</h3>
      {pedidos.map((pedido) => (
        <div key={pedido.id} className="border p-4 rounded-lg shadow">
          <p><strong>Tipo:</strong> {pedido.type}</p>
          <p><strong>Descrição:</strong> {pedido.description}</p>
          <p><strong>Status:</strong> {pedido.status}</p>
          <button className="text-green-600">Alterar Status</button>
        </div>
      ))}
    </div>
  );
}
