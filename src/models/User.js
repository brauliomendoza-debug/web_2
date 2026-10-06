const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define(
    'User',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nombre: {
        type: DataTypes.STRING(80),
        allowNull: false,
        validate: { len: { args: [3, 80], msg: 'El nombre debe tener entre 3 y 80 caracteres' } },
      },
      email: {
        type: DataTypes.STRING(120),
        allowNull: false,
        unique: true,
        validate: { isEmail: { msg: 'Correo electrónico no válido' } },
      },
      password: { type: DataTypes.STRING(100), allowNull: false },
      rol: {
        type: DataTypes.ENUM('administrador', 'moderador', 'usuario'),
        allowNull: false,
        defaultValue: 'usuario',
      },
    },
    { tableName: 'usuarios', timestamps: true }
  );

  // Nunca devolver el hash de la contraseña
  User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };

  return User;
};
