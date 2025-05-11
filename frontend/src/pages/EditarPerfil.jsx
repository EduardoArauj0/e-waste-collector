import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditarPerfil = () => {
  const [user, setUser] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cep: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);  
  const [isError, setIsError] = useState(false); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedData = localStorage.getItem('user');
        if (storedData) {
          const { id, role } = JSON.parse(storedData);
          setTipoUsuario(role);
          let response;

          if (role === 'cliente') {
            response = await axios.get(`http://localhost:3000/admin/clientes`);
            const userData = response.data.find((c) => c.id === id);
            if (userData) {
              setUser(userData);
              setFormData({ ...formData, ...userData });
            }
          } else if (role === 'empresa') {
            response = await axios.get(`http://localhost:3000/admin/empresas`);
            const userData = response.data.find((e) => e.id === id);
            if (userData) {
              setUser(userData);
              setFormData({ ...formData, ...userData });
            }
          }
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const buscarCep = async (cep) => {
    try {
      const res = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (res.data.erro) {
        alert('CEP inválido');
        return;
      }

      const { logradouro, bairro, localidade, uf } = res.data;

      setFormData((prev) => ({
        ...prev,
        street: logradouro || '',
        neighborhood: bairro || '',
        city: localidade || '',
        state: uf || '',
      }));
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'cep' && value.length === 8) {
      buscarCep(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return;

    try {
      const endpoint =
        tipoUsuario === 'cliente'
          ? `http://localhost:3000/admin/cliente/${user.id}`
          : `http://localhost:3000/admin/empresa/${user.id}`;

      const dataParaEnviar = {
        name: formData.name,
        email: formData.email,
        cep: formData.cep,
        street: formData.street,
        number: formData.number,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
      };

      await axios.put(endpoint, dataParaEnviar);

      setMessage('Perfil atualizado com sucesso!');
      setIsError(false); 
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setMessage('Erro ao atualizar perfil.');
      setIsError(true);
    }
  };

  const handleBackToHome = () => {
    const userType = localStorage.getItem('userType');

    switch (userType) {
      case 'cliente':
        navigate('/dashboard/cliente');
        break;
      case 'empresa':
        navigate('/dashboard/empresa');
        break;
      case 'admin':
        navigate('/dashboard/admin');
        break;
      default:
        navigate('/');
    }
  };

  if (loading) return <p>Carregando dados do usuário...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border rounded shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Editar Perfil</h2>
      {user ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium">Nome</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled
              className="w-full p-2 mt-1 bg-gray-100 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled
              className="w-full p-2 mt-1 bg-gray-100 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium">CEP</label>
            <input
              type="text"
              name="cep"
              value={formData.cep}
              onChange={handleChange}
              maxLength={8}
              className="w-full p-2 mt-1 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium">Rua</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              readOnly
              className="w-full p-2 mt-1 bg-gray-100 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium">Número</label>
            <input
              type="text"
              name="number"
              value={formData.number}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium">Bairro</label>
            <input
              type="text"
              name="neighborhood"
              value={formData.neighborhood}
              readOnly
              className="w-full p-2 mt-1 bg-gray-100 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium">Cidade</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              readOnly
              className="w-full p-2 mt-1 bg-gray-100 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Estado</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              readOnly
              className="w-full p-2 mt-1 bg-gray-100 border border-gray-300 rounded"
            />
          </div>

          {message && (
            <p className={`text-sm mb-4 text-center ${isError ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
          >
            Salvar Alterações
          </button>

          <button
            type="button"
            onClick={handleBackToHome}
            className="w-full mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded"
          >
            Voltar
          </button>
        </form>
      ) : (
        <p>Usuário não encontrado.</p>
      )}
    </div>
  );
};

export default EditarPerfil;
