import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <button
      onClick={handleLogout}
      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
    >
      Sair
    </button>
  );
}
