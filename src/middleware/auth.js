const jwt = require('jsonwebtoken');

/** Verifica el JWT enviado en la cabecera Authorization: Bearer <token> */
function verifyToken(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    const message = err.name === 'TokenExpiredError' ? 'La sesión ha expirado' : 'Token inválido';
    return res.status(401).json({ message });
  }
}

/** Permite el acceso solo a los roles indicados */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.rol)) {
    return res.status(403).json({ message: 'No tienes permisos para esta acción' });
  }
  next();
};

module.exports = { verifyToken, authorize };
