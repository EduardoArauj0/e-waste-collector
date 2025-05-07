import { useNavigate, Link } from 'react-router-dom';
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

      const url = 'http://localhost:3000/login';

      const res = await axios.post(url, formData);

      const user = res.data.user || res.data.admin || res.data.cliente || res.data.empresa;
      const token = res.data.token;
      const role = userType;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      localStorage.setItem('userType', userType);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userData', JSON.stringify({
        id: user.id,
        tipo: userType
      }));
    
      switch (res.data.role) {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">Login</h2>

        {response && (
          <p className={`mb-4 text-center ${response.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {response.message}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          <div className="mb-4">
            <label className="block mb-1 text-gray-700 text-sm font-semibold">Email:</label>
            <input
              type="email"
              name="email"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="mb-6">
            <label className="block mb-1 text-gray-700 text-sm font-semibold">Senha:</label>
            <input
              type="password"
              name="password"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition duration-300"
          >
            Entrar
          </button>

          <div className="text-center mt-4">
            <Link to="/recuperar-senha" className="text-sm text-green-600 hover:underline">
              Esqueceu sua senha?
            </Link>
          </div>

          <div className="flex justify-center items-center mt-6 text-sm text-gray-600">
            <span>Não tem conta?</span>
            <a href="/register" className="ml-2 text-green-600 font-semibold hover:underline">
              Cadastre-se
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
