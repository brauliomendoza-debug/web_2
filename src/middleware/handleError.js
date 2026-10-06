module.exports = (res, err) => {
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ message: err.errors.map((e) => e.message).join(', ') });
  }
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ message: 'Ya existe un registro con ese valor (nombre o correo)' });
  }
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(409).json({
      message: 'Relación inválida: la categoría no existe o tiene medicamentos asociados',
    });
  }
  console.error(err);
  return res.status(500).json({ message: 'Error interno del servidor' });
};
