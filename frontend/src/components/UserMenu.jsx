import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import userIcon from '../assets/user-icon.svg';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
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
        className="w-9 h-9 rounded-full cursor-pointer transition hover:ring-2 hover:ring-blue-400"
        onClick={toggleMenu}
      />

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg ring-1 ring-black/5 z-50 animate-fade-in">
          <div className="px-4 py-3 border-b">
            <p className="text-sm font-semibold text-gray-800">Usuário</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={() => {
              navigate('/editar-perfil');
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition"
          >
          Editar Perfil
          </button>
          <div className="border-t">
            <LogoutButton />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
