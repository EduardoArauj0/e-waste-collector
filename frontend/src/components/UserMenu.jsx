import { useEffect, useState } from 'react';
import axios from 'axios';
import { LogOut, User } from 'lucide-react';

export default function UserMenu() {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [status, setStatus] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const userType = localStorage.getItem('userType');
  const token = localStorage.getItem('token');

  const getUserUrl = () => {
    if (userType === 'cliente') return `http://localhost:3000/clientes/${userId}`;
    if (userType === 'empresa') return `http://localhost:3000/empresas/${userId}`;
    return null;
  };
  
  const fetchUser = async () => {
    try {
      const url = getUserUrl();
      if (!url) return;
  
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setUserData(response.data);
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    }
  };
  

    getUserUrl();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const endpoint = userType === 'empresa' ? 'empresas' : 'clientes';
      const response = await axios.put(`http://localhost:3000/${endpoint}/${user.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserData(response.data);
      setEditMode(false);
      setStatus('success');
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      setStatus('error');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  if (!userData) return null;

  return (
    <div className="absolute top-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-72 z-50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-green-700 flex items-center gap-1">
          <User className="w-5 h-5" /> Perfil
        </h2>
        <button onClick={handleLogout} title="Sair" className="text-red-600 hover:text-red-700">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {!editMode ? (
        <>
          <p className="mb-1">
            <strong>Email:</strong> {userData.email}
          </p>
          <p className="mb-1">
            <strong>Telefone:</strong> {userData.telefone || 'Não informado'}
          </p>
          <p className="mb-1">
            <strong>Endereço:</strong> {userData.endereco || 'Não informado'}
          </p>
          <button
            onClick={() => setEditMode(true)}
            className="mt-3 w-full bg-green-600 text-white py-1 rounded hover:bg-green-700"
          >
            Editar Dados
          </button>
        </>
      ) : (
        <form onSubmit={handleUpdate} className="space-y-2">
          <input
            name="email"
            type="email"
            value={formData.email || ''}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
            placeholder="Email"
          />
          <input
            name="telefone"
            type="text"
            value={formData.telefone || ''}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
            placeholder="Telefone"
          />
          <input
            name="endereco"
            type="text"
            value={formData.endereco || ''}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
            placeholder="Endereço"
          />
          <div className="flex justify-between gap-2">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-1 rounded hover:bg-green-700"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="flex-1 bg-gray-300 text-gray-800 py-1 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
          {status === 'success' && (
            <p className="text-green-600 text-sm text-center">Dados atualizados com sucesso!</p>
          )}
          {status === 'error' && (
            <p className="text-red-600 text-sm text-center">Erro ao atualizar dados.</p>
          )}
        </form>
      )}
    </div>
  );
}
