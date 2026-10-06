const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'Categoria',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nombre: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: true,
        validate: { notEmpty: { msg: 'El nombre de la categoría es obligatorio' } },
      },
      descripcion: { type: DataTypes.STRING(255), allowNull: true },
    },
    { tableName: 'categorias', timestamps: true }
  );
