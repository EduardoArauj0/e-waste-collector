import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import * as yup from 'yup';

const loginSchema = yup.object().shape({
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().required('Senha é obrigatória'),
});

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [userType, setUserType] = useState('cliente');
  const [errors, setErrors] = useState({});
  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse(null);

    try {
      await loginSchema.validate(formData, { abortEarly: false });

      const url =
        userType === 'admin'
          ? 'http://localhost:3000/admin/login'
          : 'http://localhost:3000/users/login';

      const res = await axios.post(url, formData);

      const user = res.data.user || res.data.admin || res.data.cliente || res.data.empresa;
      const token = res.data.token;
      const role = res.data.role || user.role;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      localStorage.setItem('userType', role);

      switch (role) {
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
          navigate('/dashboard');
      }

      setResponse({ type: 'success', message: 'Login realizado com sucesso!' });
    } catch (err) {
      if (err.name === 'ValidationError') {
        const validationErrors = {};
        err.inner.forEach((e) => {
          validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
      } else {
        setResponse({
          type: 'error',
          message: err.response?.data?.message || err.response?.data?.error || 'Erro ao fazer login',
        });
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>

      {response && (
        <p className={`mb-4 ${response.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {response.message}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label>Tipo de usuário:</label>
          <select
            className="w-full border p-2 rounded"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="cliente">Cliente</option>
            <option value="empresa">Empresa</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="mb-4">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            className="w-full border p-2 rounded"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div className="mb-4">
          <label>Senha:</label>
          <input
            type="password"
            name="password"
            className="w-full border p-2 rounded"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Entrar
        </button>

        <p className="text-sm mt-4">
          Ainda não tem conta?{' '}
          <a href="/register" className="text-blue-600 underline">
            Cadastre-se aqui
          </a>
        </p>
      </form>
    </div>
  );
}
