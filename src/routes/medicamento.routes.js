const router = require('express').Router();
const ctrl = require('../controllers/medicamento.controller');
const { verifyToken, authorize } = require('../middleware/auth');

router.use(verifyToken);
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.post('/', authorize('administrador', 'moderador'), ctrl.create);
router.put('/:id', authorize('administrador', 'moderador'), ctrl.update);
router.delete('/:id', authorize('administrador'), ctrl.remove);

module.exports = router;
