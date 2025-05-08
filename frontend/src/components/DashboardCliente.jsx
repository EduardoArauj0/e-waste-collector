import { useEffect, useState } from 'react';
import axios from 'axios';
import UserMenu from "./UserMenu";

export default function DashboardCliente() {
  const [coletas, setColetas] = useState([]);
  const [residuos, setResiduos] = useState([{ type: '', description: '' }]);
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

  const handleChange = (index, e) => {
    const updated = [...residuos];
    updated[index][e.target.name] = e.target.value;
    setResiduos(updated);
  };

  const handleAddResíduo = () => {
    setResiduos([...residuos, { type: '', description: '' }]);
  };

  const handleRemoveResíduo = (index) => {
    const updated = [...residuos];
    updated.splice(index, 1);
    setResiduos(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/discard-requests', {
        userId: user.id,
        residuos,
      });
      

      setResponse({ type: 'success', message: 'Pedido(s) criado(s) com sucesso!' });
      setResiduos([{ type: '', description: '' }]);
      fetchColetas();
    } catch (err) {
      console.error('Erro ao criar pedidos:', err);
      setResponse({ type: 'error', message: 'Erro ao criar pedidos' });
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
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        {residuos.map((residuo, index) => (
          <div key={index} className="flex flex-wrap gap-2 items-center">
            <input
              type="text"
              name="type"
              placeholder="Tipo de resíduo"
              value={residuo.type}
              onChange={(e) => handleChange(index, e)}
              className="border p-2 rounded flex-1 min-w-[150px]"
              required
            />
            <input
              type="text"
              name="description"
              placeholder="Descrição"
              value={residuo.description}
              onChange={(e) => handleChange(index, e)}
              className="border p-2 rounded flex-1 min-w-[150px]"
              required
            />
            {residuos.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveResíduo(index)}
                className="text-red-500 text-sm"
              >
                Remover
              </button>
            )}
          </div>
        ))}
        <div className="flex gap-4 mt-2">
          <button
            type="button"
            onClick={handleAddResíduo}
            className="bg-gray-300 px-3 py-1 rounded"
          >
            + Adicionar Resíduo
          </button>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Enviar
          </button>
        </div>
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
