const { User } = require('../models');
const handleError = require('../middleware/handleError');

const ROLES = ['administrador', 'moderador', 'usuario'];

exports.getAll = async (req, res) => {
  try {
    res.json(await User.findAll({ order: [['id', 'ASC']] }));
  } catch (err) {
    handleError(res, err);
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { rol } = req.body;
    if (!ROLES.includes(rol)) return res.status(400).json({ message: 'Rol no válido' });
    if (Number(req.params.id) === req.user.id) {
      return res.status(400).json({ message: 'No puedes cambiar tu propio rol' });
    }
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    await user.update({ rol });
    res.json(user);
  } catch (err) {
    handleError(res, err);
  }
};

exports.remove = async (req, res) => {
  try {
    if (Number(req.params.id) === req.user.id) {
      return res.status(400).json({ message: 'No puedes eliminar tu propia cuenta' });
    }
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    await user.destroy();
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    handleError(res, err);
  }
};
