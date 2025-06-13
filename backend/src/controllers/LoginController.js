const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Admin } = require('../models'); 

module.exports = {
  async login(req, res) {
    const { email, password } = req.body;

    try {
      // Lógica de login do Admin 
      const admin = await Admin.findOne({ where: { email } });
      if (admin) {
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).json({ message: 'Senha incorreta' });

        const token = jwt.sign({ email: admin.email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.json({
          message: 'Login realizado com sucesso',
          token,
          user: { email: admin.email, role: 'admin' },
        });
      }

      // Lógica de login (clientes/empresas)
      const user = await User.findOne({ where: { email } });

      if (!user) return res.status(401).json({ message: 'Email ou senha inválidos' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Email ou senha inválidos' });

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

      const userData = user.toJSON();
      delete userData.password;

      return res.json({
        message: 'Login realizado com sucesso',
        token,
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          cep: userData.cep,
          street: userData.street,
          number: userData.number,
          neighborhood: userData.neighborhood,
          city: userData.city,
          state: userData.state
        }
      });
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao fazer login' });
    }
  }
};