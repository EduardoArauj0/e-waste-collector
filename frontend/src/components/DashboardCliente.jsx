import { useEffect, useState } from 'react';
import axios from 'axios';
import LogoutButton from './LogoutButton';

export default function DashboardCliente() {
  const [coletas, setColetas] = useState([]);
  const [formData, setFormData] = useState({ type: '', description: '' });
  const [response, setResponse] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchColetas = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/cliente/${user.id}/coletas`);
      setColetas(res.data);
    } catch (error) {
      console.error('Erro ao buscar coletas:', error);
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
      await axios.post('http://localhost:3000/discardrequests', {
        ...formData,
        userId: user.id,
      });
      setResponse({ type: 'success', message: 'Pedido criado com sucesso!' });
      setFormData({ type: '', description: '' });
      fetchColetas(); // agora a função está disponível aqui
    } catch (err) {
      console.error('Erro ao criar pedido:', err);
      setResponse({ type: 'error', message: 'Erro ao criar pedido' });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Dashboard Cliente</h2>
        <LogoutButton />
      </div>

      <h3 className="text-lg font-semibold mb-2">Novo Pedido de Coleta:</h3>
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          name="type"
          placeholder="Tipo de resíduo"
          value={formData.type}
          onChange={handleChange}
          className="border p-2 rounded mr-2"
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Descrição"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 rounded mr-2"
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

      <h3 className="text-lg font-semibold mb-2">Minhas Coletas:</h3>
      {coletas.length === 0 ? (
        <p>Nenhuma coleta encontrada.</p>
      ) : (
        <ul className="list-disc ml-6">
          {coletas.map((coleta) => (
            <li key={coleta.id}>
              {coleta.type} - {coleta.description} ({coleta.status})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
