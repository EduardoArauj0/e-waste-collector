import { useEffect, useState } from 'react';
import axios from 'axios';
import UserMenu from "./UserMenu";

export default function DashboardCliente() {
  const [coletas, setColetas] = useState([]);
  const [formData, setFormData] = useState({ type: '', description: '' });
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchColetas = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/discard-requests/cliente/${user.id}`);
      setColetas(res.data);
    } catch (error) {
      console.error('Erro ao buscar coletas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColetas();
  }, [user.id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {   
      await axios.post('http://localhost:3000/discard-requests', {
        ...formData,
        userId: user.id,
      });      
      
      setResponse({ type: 'success', message: 'Pedido criado com sucesso!' });
      setFormData({ type: '', description: '' });
      fetchColetas();
    } catch (err) {
      console.error('Erro ao criar pedido:', err);
      setResponse({ type: 'error', message: 'Erro ao criar pedido' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendente':
        return 'text-yellow-600';
      case 'aceito':
        return 'text-green-600';
      case 'recusado':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Dashboard Cliente</h2>
        <UserMenu />
      </div>

      <h3 className="text-lg font-semibold mb-2">Novo Pedido de Coleta:</h3>
      <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap gap-2">
        <input
          type="text"
          name="type"
          placeholder="Tipo de resíduo"
          value={formData.type}
          onChange={handleChange}
          className="border p-2 rounded flex-1 min-w-[150px]"
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Descrição"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 rounded flex-1 min-w-[150px]"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Enviar
        </button>
      </form>

      {response && (
        <p className={`mb-4 ${response.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {response.message}
        </p>
      )}

      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Minhas Coletas:</h3>
        <button
          onClick={fetchColetas}
          className="text-sm text-blue-600 underline"
        >
          Atualizar
        </button>
      </div>

      {loading ? (
        <p>Carregando coletas...</p>
      ) : coletas.length === 0 ? (
        <p>Nenhuma coleta encontrada.</p>
      ) : (
        <div className="grid gap-4">
          {coletas.map((coleta) => (
        <div
          key={coleta.id}
          className="border rounded-xl shadow-sm p-4 bg-white"
        >
          <p className="font-semibold">Tipo: {coleta.type}</p>
          <p>Descrição: {coleta.description}</p>
          <p className={`mt-1 font-medium ${getStatusColor(coleta.status)}`}>
            Status: {coleta.status}
          </p>

          {coleta.status === 'aceito' && coleta.company?.name && (
            <p className="text-sm text-gray-700">
              Coleta aceita por: <span className="font-medium">{coleta.company.name}</span>
            </p>
          )}
        </div>
      ))}
        </div>
      )}
    </div>
  );
}
