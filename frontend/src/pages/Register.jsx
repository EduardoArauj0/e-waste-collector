import { useState, useEffect } from 'react';
import axios from 'axios';
import * as yup from 'yup';

const registerSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').required('Senha é obrigatória'),
  role: yup.string().oneOf(['cliente', 'empresa'], 'Perfil inválido').required('Perfil é obrigatório'),
  cep: yup.string().required('CEP é obrigatório'),
  street: yup.string().required('Rua é obrigatória'),
  number: yup.string().required('Número é obrigatório'),
  neighborhood: yup.string().required('Bairro é obrigatório'),
  city: yup.string().required('Cidade é obrigatória'),
  state: yup.string().required('Estado é obrigatório'),
});

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    cep: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
  });

  const [errors, setErrors] = useState({});
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const fetchAddress = async () => {
      const cleanedCep = formData.cep.replace(/\D/g, '');
      if (cleanedCep.length === 8) {
        try {
          const response = await axios.get(`https://viacep.com.br/ws/${cleanedCep}/json/`);
          if (!response.data.erro) {
            setFormData((prevData) => ({
              ...prevData,
              street: response.data.logradouro,
              neighborhood: response.data.bairro,
              city: response.data.localidade,
              state: response.data.uf,
            }));
          }
        } catch (error) {
          console.error('Erro ao buscar endereço:', error);
        }
      }
    };

    fetchAddress();
  }, [formData.cep]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerSchema.validate(formData, { abortEarly: false });

      const response = await axios.post('http://localhost:3000/users/register', formData);
      console.log('Resposta do backend:', response.data);

      setResponse({ type: 'success', message: 'Usuário cadastrado com sucesso!' });
    } catch (err) {
      console.error('Erro no cadastro:', err);
      if (err.name === 'ValidationError') {
        const validationErrors = {};
        err.inner.forEach((e) => {
          validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
      } else {
        setResponse({ type: 'error', message: err.response?.data?.error || 'Erro ao cadastrar' });
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Cadastro</h2>
      {response && (
        <p className={`mb-4 ${response.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {response.message}
        </p>
      )}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input
          name="name"
          placeholder="Nome"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={formData.password}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Selecione o perfil</option>
          <option value="cliente">Cliente</option>
          <option value="empresa">Empresa</option>
        </select>
        {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}

        <input
          name="cep"
          placeholder="CEP"
          value={formData.cep}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            setFormData({ ...formData, cep: value });
            setErrors({ ...errors, cep: '' });
          }}
          className="border p-2 rounded"
        />
        {errors.cep && <p className="text-red-500 text-sm">{errors.cep}</p>}

        <input
          name="street"
          placeholder="Rua"
          value={formData.street}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        {errors.street && <p className="text-red-500 text-sm">{errors.street}</p>}

        <input
          name="number"
          placeholder="Número"
          value={formData.number}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        {errors.number && <p className="text-red-500 text-sm">{errors.number}</p>}

        <input
          name="neighborhood"
          placeholder="Bairro"
          value={formData.neighborhood}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        {errors.neighborhood && <p className="text-red-500 text-sm">{errors.neighborhood}</p>}

        <input
          name="city"
          placeholder="Cidade"
          value={formData.city}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}

        <input
          name="state"
          placeholder="Estado"
          value={formData.state}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}
