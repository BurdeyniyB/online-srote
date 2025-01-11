const Router = require("express");
const router = new Router();
const basketController = require('../controller/basketController');
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, basketController.create);
router.get("/", authMiddleware, basketController.getAll);
router.delete("/", authMiddleware, basketController.delete);

module.exports = router;
