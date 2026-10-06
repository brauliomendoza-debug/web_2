require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const { createDatabaseIfNotExists } = require('./src/config/database');
const { sequelize } = require('./src/models');

if (!process.env.JWT_SECRET) {
  console.error('Falta JWT_SECRET en el archivo .env');
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

// API
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/categorias', require('./src/routes/categoria.routes'));
app.use('/api/medicamentos', require('./src/routes/medicamento.routes'));
app.use('/api/usuarios', require('./src/routes/user.routes'));
app.use('/api', (req, res) => res.status(404).json({ message: 'Ruta no encontrada' }));

// Front-end estático
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await createDatabaseIfNotExists(); // 1) crea bd_Farmacia
    await sequelize.sync();            // 2) crea tablas y relaciones
    app.listen(PORT, () => console.log(`Servidor listo en http://localhost:${PORT}`));
  } catch (err) {
    console.error('No se pudo iniciar el servidor:', err.message);
    process.exit(1);
  }
})();
