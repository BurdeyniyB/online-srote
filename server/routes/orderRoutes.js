const Router = require('express');
const orderController = require('../controller/orderController');
const checkRole = require('../middleware/checkRoleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const router = new Router();

router.post('/', orderController.create);
router.get('/', authMiddleware, orderController.getAll);
router.put('/', authMiddleware, orderController.updateStatus);
router.patch('/tracking', authMiddleware, orderController.updateTracking);
router.patch('/notes', authMiddleware, orderController.updateNotes);
router.delete('/:orderId', checkRole("ADMIN"), orderController.delete);

module.exports = router;
