const Router = require("express");
const brandController = require("../controller/brandController");
const router = new Router();

router.post('/', brandController.create)
router.get('/', brandController.getAll)

module.exports = router;
