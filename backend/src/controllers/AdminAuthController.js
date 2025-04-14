import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const emailEnv = process.env.ADMIN_EMAIL;
const senhaHash = process.env.ADMIN_PASSWORD;

const login = async (req, res) => {
  const { email, password } = req.body;

  if (email !== emailEnv) {
    return res.status(401).json({ message: 'Email inválido.' });
  }

  const senhaCorreta = await bcrypt.compare(password, senhaHash);

  if (!senhaCorreta) {
    return res.status(401).json({ message: 'Senha incorreta.' });
  }

  const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({
    token,
    admin: { email },
    role: 'admin',
  });
};

export default { login };
