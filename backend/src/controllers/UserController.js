const axios = require('axios');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const { registerSchema } = require('../validations/userValidation');

module.exports = {
  async register(req, res) {
    try {
      const { cep, email } = req.body;

      // Verifica se o email já está em uso
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email já cadastrado.' });
      }

      // Consulta endereço no ViaCEP
      const viaCepRes = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (viaCepRes.data.erro) {
        return res.status(400).json({ error: 'CEP inválido' });
      }

      const { logradouro, bairro, localidade, uf } = viaCepRes.data;

      req.body.street = req.body.street || logradouro;
      req.body.neighborhood = req.body.neighborhood || bairro;
      req.body.city = req.body.city || localidade;
      req.body.state = req.body.state || uf;

      // Validação do corpo da requisição
      await registerSchema.validate(req.body, { abortEarly: false });

      const {
        name,
        password,
        role,
        street,
        number,
        neighborhood,
        city,
        state
      } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
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
      if (err.name === 'ValidationError') {
        return res.status(400).json({ error: 'Erro de validação', messages: err.errors });
      }

      return res.status(500).json({
        error: 'Erro ao cadastrar usuário',
        details: err.message
      });
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