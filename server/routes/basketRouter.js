const Router = require("express");
const router = new Router();
const basketController = require('../controller/basketController');
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, basketController.create);
router.put("/", authMiddleware, basketController.setQuantity);
router.get("/", authMiddleware, basketController.getAll);
router.delete("/:userId/:deviceId", authMiddleware, basketController.delete);

module.exports = router;
