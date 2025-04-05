const { User } = require('../models');

module.exports = {
  // Cadastro de novo usuário
  async register(req, res) {
    try {
      const user = await User.create(req.body);
      return res.status(201).json(user);
    } catch (err) {
      return res.status(400).json({ error: 'Erro ao cadastrar usuário', details: err });
    }
  },

  // Login básico (sem JWT por enquanto)
  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Email ou senha inválidos' });
      }

      return res.json({ message: 'Login bem-sucedido', user });
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao fazer login' });
    }
  },

  // Listar usuários (opcional para admin)
  async index(req, res) {
    try {
      const users = await User.findAll();
      return res.json(users);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
  }
};
