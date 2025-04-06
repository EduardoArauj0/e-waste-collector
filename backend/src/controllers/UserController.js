const bcrypt = require('bcrypt');
const { User } = require('../models');

module.exports = {
  async register(req, res) {
    try {
      const {
        name,
        email,
        password,
        role,
        cep,
        street,
        number,
        neighborhood,
        city,
        state
      } = req.body;

      const user = await User.create({
        name,
        email,
        password,
        role,
        cep,
        street,
        number,
        neighborhood,
        city,
        state
      });

      const userData = user.toJSON();
      delete userData.password;

      return res.status(201).json(userData);
    } catch (err) {
      return res.status(400).json({
        error: 'Erro ao cadastrar usuário',
        details: err
      });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ error: 'Email ou senha inválidos' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ error: 'Email ou senha inválidos' });
      }

      const userData = user.toJSON();
      delete userData.password;

      return res.json({
        message: 'Login bem-sucedido',
        user: userData
      });
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao fazer login' });
    }
  },

  async index(req, res) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] } 
      });

      return res.json(users);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
  }
};
