const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const handleError = require('../middleware/handleError');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASS_RE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
const ROLES = ['administrador', 'moderador', 'usuario'];

const signToken = (user) =>
  jwt.sign({ id: user.id, nombre: user.nombre, rol: user.rol }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '2h',
  });

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    const rol = req.body.rol || 'usuario';
    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Nombre, correo y contraseña son obligatorios' });
    }
    if (!ROLES.includes(rol)) {
      return res.status(400).json({ message: 'Rol no válido' });
    }
    if (!EMAIL_RE.test(email)) return res.status(400).json({ message: 'Correo no válido' });
    if (!PASS_RE.test(password)) {
      return res.status(400).json({ message: 'La contraseña debe tener mínimo 8 caracteres, con letras y números' });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ nombre: nombre.trim(), email: email.trim().toLowerCase(), password: hash, rol });
    res.status(201).json({ message: 'Usuario registrado correctamente', user });
  } catch (err) {
    handleError(res, err);
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });

    const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });
    const ok = user && (await bcrypt.compare(password, user.password));
    if (!ok) return res.status(401).json({ message: 'Credenciales incorrectas' });

    res.json({ token: signToken(user), user });
  } catch (err) {
    handleError(res, err);
  }
};

// GET /api/auth/me
exports.me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    handleError(res, err);
  }
};
