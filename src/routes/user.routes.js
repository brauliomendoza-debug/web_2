const router = require('express').Router();
const ctrl = require('../controllers/user.controller');
const { verifyToken, authorize } = require('../middleware/auth');

router.use(verifyToken, authorize('administrador'));
router.get('/', ctrl.getAll);
router.put('/:id/rol', ctrl.updateRole);
router.delete('/:id', ctrl.remove);

module.exports = router;
