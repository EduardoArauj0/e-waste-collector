import { useEffect, useState } from 'react';
import axios from 'axios';

export default function DashboardCliente() {
  const [pedidos, setPedidos] = useState([]);
  const [form, setForm] = useState({ type: '', description: '' });
  const [userId] = useState(1); 

  const fetchPedidos = async () => {
    const res = await axios.get('http://localhost:3000/discard-requests');
    const pedidosDoUsuario = res.data.filter(p => p.userId === userId);
    setPedidos(pedidosDoUsuario);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:3000/discard-requests', {
      ...form,
      userId
    });
    setForm({ type: '', description: '' });
    fetchPedidos();
  };

  useEffect(() => {
    const fetchPedidos = async () => {
      const res = await axios.get('http://localhost:3000/discard-requests');
      const pedidosDoUsuario = res.data.filter(p => p.userId === userId);
      setPedidos(pedidosDoUsuario);
    };
  
    fetchPedidos();
  }, [userId]);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">Meus pedidos de descarte</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-2">
          <label>Tipo:</label>
          <input
            type="text"
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-2">
          <label>Descrição:</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Criar pedido
        </button>
      </form>

      <ul>
        {pedidos.map(p => (
          <li key={p.id} className="border-b py-2">
            <strong>{p.type}</strong> - {p.status}
            <p className="text-sm text-gray-600">{p.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
