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
  const [errors, setErrors] = useState({});
  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginSchema.validate(formData, { abortEarly: false });

      const res = await axios.post('http://localhost:3000/login', formData);
      const { user, message } = res.data;

      localStorage.setItem('user', JSON.stringify(user));

      switch (user.role) {
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

      setResponse({ type: 'success', message });

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
          message: err.response?.data?.error || 'Erro ao fazer login',
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
      </form>
    </div>
  );
}
