import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import userIcon from '../assets/user-icon.svg';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      const userData = JSON.parse(storedData);
      setUser(userData);
    }
  }, []);

  return (
    <div className="relative inline-block text-left">
      <img
        src={userIcon} 
        alt="Perfil"
        className="w-8 h-8 cursor-pointer rounded-full"
        onClick={toggleMenu}
      />

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
          <div className="px-4 py-2 text-gray-800 border-b">
            <p className="text-sm font-semibold">Usuário</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={() => navigate('/editar-perfil')}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Editar Perfil
          </button>
          <LogoutButton />
        </div>
      )}
    </div>
  );
};

export default UserMenu;
