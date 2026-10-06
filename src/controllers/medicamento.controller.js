const { Medicamento, Categoria } = require('../models');
const handleError = require('../middleware/handleError');

const include = [{ model: Categoria, as: 'categoria', attributes: ['id', 'nombre'] }];
const pick = (b) => ({
  nombre: b.nombre?.trim(),
  laboratorio: b.laboratorio?.trim(),
  precio: b.precio,
  stock: b.stock,
  fecha_vencimiento: b.fecha_vencimiento,
  categoriaId: b.categoriaId,
});

// READ (todos)
exports.getAll = async (req, res) => {
  try {
    res.json(await Medicamento.findAll({ include, order: [['nombre', 'ASC']] }));
  } catch (err) {
    handleError(res, err);
  }
};

// READ (uno)
exports.getOne = async (req, res) => {
  try {
    const row = await Medicamento.findByPk(req.params.id, { include });
    if (!row) return res.status(404).json({ message: 'Medicamento no encontrado' });
    res.json(row);
  } catch (err) {
    handleError(res, err);
  }
};

// CREATE
exports.create = async (req, res) => {
  try {
    const row = await Medicamento.create(pick(req.body));
    res.status(201).json(await Medicamento.findByPk(row.id, { include }));
  } catch (err) {
    handleError(res, err);
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const row = await Medicamento.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'Medicamento no encontrado' });
    await row.update(pick(req.body));
    res.json(await Medicamento.findByPk(row.id, { include }));
  } catch (err) {
    handleError(res, err);
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    const row = await Medicamento.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'Medicamento no encontrado' });
    await row.destroy();
    res.json({ message: 'Medicamento eliminado' });
  } catch (err) {
    handleError(res, err);
  }
};
