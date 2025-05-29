import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserEdit, FaCheckCircle, FaExclamationCircle, FaArrowLeft } from 'react-icons/fa';

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
              setFormData((prev) => ({ ...prev, ...userData }));
            }
          } else if (role === 'empresa') {
            response = await axios.get(`http://localhost:3000/admin/empresas`);
            const userData = response.data.find((e) => e.id === id);
            if (userData) {
              setUser(userData);
              setFormData((prev) => ({ ...prev, ...userData }));
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

  if (loading) return <p className="text-center mt-10 text-gray-500">Carregando dados do usuário...</p>;

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded-2xl shadow-lg">
      <div className="flex items-center justify-center mb-6 gap-2">
        <FaUserEdit className="text-3xl text-green-600" />
        <h2 className="text-2xl font-bold text-gray-800">Editar Perfil</h2>
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Nome</label>
              <input type="text" name="name" value={formData.name} disabled
                className="w-full mt-1 p-2 rounded bg-gray-100 border border-gray-300" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" value={formData.email} disabled
                className="w-full mt-1 p-2 rounded bg-gray-100 border border-gray-300" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">CEP</label>
              <input type="text" name="cep" value={formData.cep} onChange={handleChange} maxLength={8}
                className="w-full mt-1 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Rua</label>
              <input type="text" name="street" value={formData.street} readOnly
                className="w-full mt-1 p-2 rounded bg-gray-100 border border-gray-300" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Número</label>
              <input type="text" name="number" value={formData.number} onChange={handleChange}
                className="w-full mt-1 p-2 rounded border border-gray-300" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Bairro</label>
              <input type="text" name="neighborhood" value={formData.neighborhood} readOnly
                className="w-full mt-1 p-2 rounded bg-gray-100 border border-gray-300" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Cidade</label>
              <input type="text" name="city" value={formData.city} readOnly
                className="w-full mt-1 p-2 rounded bg-gray-100 border border-gray-300" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Estado</label>
              <input type="text" name="state" value={formData.state} readOnly
                className="w-full mt-1 p-2 rounded bg-gray-100 border border-gray-300" />
            </div>
          </div>

          {message && (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-md text-sm ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {isError ? <FaExclamationCircle /> : <FaCheckCircle />}
              <span>{message}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded shadow transition"
          >
            Salvar Alterações
          </button>

          <button
            type="button"
            onClick={handleBackToHome}
            className="w-full flex items-center justify-center gap-2 mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded transition"
          >
            <FaArrowLeft />
            Voltar ao Dashboard
          </button>
        </form>
      ) : (
        <p className="text-center text-red-600">Usuário não encontrado.</p>
      )}
    </div>
  );
};

export default EditarPerfil;