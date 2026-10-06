const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'Medicamento',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: { notEmpty: { msg: 'El nombre del medicamento es obligatorio' } },
      },
      laboratorio: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: { notEmpty: { msg: 'El laboratorio es obligatorio' } },
      },
      precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: { min: { args: [0], msg: 'El precio no puede ser negativo' } },
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: { min: { args: [0], msg: 'El stock no puede ser negativo' }, isInt: { msg: 'El stock debe ser un entero' } },
      },
      fecha_vencimiento: { type: DataTypes.DATEONLY, allowNull: false },
    },
    { tableName: 'medicamentos', timestamps: true }
  );
