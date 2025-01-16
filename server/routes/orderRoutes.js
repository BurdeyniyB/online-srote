const Router = require('express');
const orderController = require('../controller/orderController');
const checkRole = require('../middleware/checkRoleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const router = new Router();

router.post('/', authMiddleware, orderController.create);
router.get('/', authMiddleware, orderController.getAll);
router.delete('/:orderId', checkRole("ADMIN"), orderController.delete);

module.exports = router;