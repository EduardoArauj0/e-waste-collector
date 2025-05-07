const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD;

module.exports = {
  async login(req, res) {
    const { email, password } = req.body;

    try {
      if (email === ADMIN_EMAIL) {
        const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
        if (!isMatch) return res.status(401).json({ message: 'Senha incorreta' });

        const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.json({
          message: 'Login admin bem-sucedido',
          token,
          user: { email },
          role: 'admin',
        });
      }

      const user = await User.findOne({ where: { email } });

      if (!user) return res.status(401).json({ error: 'Email ou senha inválidos' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ error: 'Email ou senha inválidos' });

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

      const userData = user.toJSON();
      delete userData.password;

      return res.json({
        message: 'Login bem-sucedido',
        token,
        user: userData,
        role: user.role,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao fazer login' });
    }
  }
};
