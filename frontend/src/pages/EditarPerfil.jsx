import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedData = localStorage.getItem('userData');
        if (storedData) {
          const { id, tipo } = JSON.parse(storedData);
          setTipoUsuario(tipo);
          let response;

          if (tipo === 'cliente') {
            response = await axios.get(`http://localhost:3000/admin/clientes`);
            const userData = response.data.find((c) => c.id === id);
            if (userData) {
              setUser(userData);
              setFormData({ ...formData, ...userData });
            }
          } else if (tipo === 'empresa') {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          ? `http://localhost:3000/clientes/${user.id}`
          : `http://localhost:3000/empresas/${user.id}`;

      const dataParaEnviar = {
        cep: formData.cep,
        street: formData.street,
        number: formData.number,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
      };

      await axios.put(endpoint, dataParaEnviar);

      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Erro ao atualizar perfil.');
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
              value={formData.name}
              disabled
              className="w-full p-2 mt-1 bg-gray-100 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={formData.email}
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

          <div className="mb-5">
            <label className="block text-sm font-medium">Estado</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              readOnly
              className="w-full p-2 mt-1 bg-gray-100 border border-gray-300 rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Atualizar Perfil
          </button>
          <Link
            to="/recuperar-senha"
            className="block w-full mt-3 py-2 text-center bg-green-100 text-green-700 rounded hover:bg-green-200"
            >
            Esqueceu sua senha?
            </Link>
          
        </form>
      ) : (
        <p>Não foi possível carregar os dados do usuário.</p>
      )}
    </div>
    
  );
};

export default EditarPerfil;
