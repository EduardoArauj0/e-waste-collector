import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import axios from 'axios';
import userIcon from '../assets/user-icon.svg';


const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedData = localStorage.getItem('userData');
        if (storedData) {
          const { id, tipo } = JSON.parse(storedData);
          let response;

          if (tipo === 'cliente') {
            response = await axios.get(`http://localhost:3000/admin/clientes`);
            const userData = response.data.find((cliente) => cliente.id === id);
            setUser(userData);
          } else if (tipo === 'empresa') {
            response = await axios.get(`http://localhost:3000/admin/empresas`);
            const userData = response.data.find((empresa) => empresa.id === id);
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="relative inline-block text-left">
      <img src={userIcon} 
        alt="Perfil"
        className="w-8 h-8 cursor-pointer rounded-full"
        onClick={toggleMenu}
      />

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
          <div className="px-4 py-2 text-gray-800 border-b">
            <p className="text-sm font-semibold">{user?.nome || 'Usuário'}</p>
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
