const { sequelize } = require('../config/database');

const User = require('./User')(sequelize);
const Categoria = require('./Categoria')(sequelize);
const Medicamento = require('./Medicamento')(sequelize);

// ---------- RELACIONES (1 : N) ----------
// Una categoría tiene muchos medicamentos
Categoria.hasMany(Medicamento, {
  foreignKey: { name: 'categoriaId', allowNull: false },
  as: 'medicamentos',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});
// Un medicamento pertenece a una categoría
Medicamento.belongsTo(Categoria, {
  foreignKey: { name: 'categoriaId', allowNull: false },
  as: 'categoria',
});

module.exports = { sequelize, User, Categoria, Medicamento };
