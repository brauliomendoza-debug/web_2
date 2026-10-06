const { Categoria, Medicamento } = require('../models');
const handleError = require('../middleware/handleError');

// READ (todas) — incluye el conteo de medicamentos
exports.getAll = async (req, res) => {
  try {
    const rows = await Categoria.findAll({
      include: [{ model: Medicamento, as: 'medicamentos', attributes: ['id'] }],
      order: [['nombre', 'ASC']],
    });
    res.json(
      rows.map((c) => {
        const { medicamentos, ...data } = c.toJSON();
        return { ...data, totalMedicamentos: medicamentos.length };
      })
    );
  } catch (err) {
    handleError(res, err);
  }
};

// READ (una)
exports.getOne = async (req, res) => {
  try {
    const row = await Categoria.findByPk(req.params.id, {
      include: [{ model: Medicamento, as: 'medicamentos' }],
    });
    if (!row) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json(row);
  } catch (err) {
    handleError(res, err);
  }
};

// CREATE
exports.create = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const row = await Categoria.create({ nombre: nombre?.trim(), descripcion });
    res.status(201).json(row);
  } catch (err) {
    handleError(res, err);
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const row = await Categoria.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'Categoría no encontrada' });
    const { nombre, descripcion } = req.body;
    await row.update({ nombre: nombre?.trim(), descripcion });
    res.json(row);
  } catch (err) {
    handleError(res, err);
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    const row = await Categoria.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'Categoría no encontrada' });
    await row.destroy();
    res.json({ message: 'Categoría eliminada' });
  } catch (err) {
    handleError(res, err);
  }
};
