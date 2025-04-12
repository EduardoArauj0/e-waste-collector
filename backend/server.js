require('dotenv').config();
const express = require('express');
const app = express();
const adminAuthRoutes = require('./src/routes/adminAuthRoutes');
const userRoutes = require('./src/routes/userRoutes');
const discardRequestRoutes = require('./src/routes/discardRequestRoutes');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use('/admin', adminAuthRoutes);
app.use('/users', userRoutes);
app.use('/discard-requests', discardRequestRoutes);

console.log('Config:', process.env.DB_NAME);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});



