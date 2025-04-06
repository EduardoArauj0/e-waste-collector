require('dotenv').config();
const express = require('express');
const app = express();
const userRoutes = require('./src/routes/userRoutes');
const discardRoutes = require('./src/routes/discardRequestRoutes');

app.use(express.json());
app.use('/users', userRoutes);
app.use('/discards', discardRoutes);

console.log('Config:', process.env.DB_NAME);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});



